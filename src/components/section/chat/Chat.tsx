import * as React from 'react';
import Helmet from 'react-helmet';

import css from './Chat.module.scss';
import Icon from '../../util/Icon';
import MessageBox from './MessageBox';
import Snackbar from './Snackbar';

import MessageGroup from './MessageGroup';
import MessageComponent from './Message';

import { Message } from 'riotchat.js/dist/internal/Message';
import { RiotClient } from '../../..';
import { ChannelType } from 'riotchat.js/dist/api/v1/channels';
import { User, Collection } from 'riotchat.js';
import MessageSeparator from './MessageSeparator';

type ChatProps = {
	channel: string,
	openDrawer?: (drawer: "menu" | "members") => void
}

export default class Chat extends React.Component<ChatProps, {
	name: string,
	type: "chat" | "dm" | "self",
	description: string,
	user?: User,
	messages: Collection<string, Message>
}> {
	mounted: boolean;
	scroll: number;
	chatRef: React.RefObject<HTMLDivElement>;
	scrollToBottomRef: React.RefObject<HTMLDivElement>;
	constructor(props: ChatProps) {
		super(props);
		this.mounted = false;
		this.scroll = 0;
		this.chatRef = React.createRef();
		this.scrollToBottomRef = React.createRef();
		this.state = {
			description: "",
			messages: new Collection<string, Message>(),
			name: "",
			type: "chat"
		}

		this.scrollToBottom = this.scrollToBottom.bind(this);
		this.reloadChannel = this.reloadChannel.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.onMessage = this.onMessage.bind(this);
		this.onSend = this.onSend.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
	}

	scrollToBottom() {
		setTimeout(() => {
			if(this.scrollToBottomRef.current === null) return;
			this.scrollToBottomRef.current.scrollIntoView({
				block: "end",
				inline: "end"
			});
		}, 0);
	}

	componentDidMount() {
		this.mounted = true;
		RiotClient.on('message', this.onMessage);
		RiotClient.on('messageUpdate', this.onMessage);
		RiotClient.on('userUpdate', this.updateUser);
		this.reloadChannel(this.props);
		(window as any).chatRef = this.chatRef;
	}

	componentWillUnmount() {
		this.mounted = false;
		RiotClient.removeListener('message', this.onMessage);
		RiotClient.removeListener('messageUpdate', this.onMessage);
		RiotClient.removeListener('userUpdate', this.updateUser);
		(window as any).chatRef = undefined;
	}

	componentWillReceiveProps(props: ChatProps) {
		if(this.props.channel !== props.channel) this.reloadChannel(props);
	}

	async reloadChannel(props: ChatProps) {
		if(!this.mounted) return;
		let messages = new Collection<string, Message>();
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				name: "",
				type: "chat",
				description: "",
				messages
			});
		});
		try {
			let channel = await RiotClient.fetchChannel(props.channel);
			this.setState((prevState) => {
				let name = "insert implement fucking channel names";
				let type = "chat";
				let user: User | undefined = undefined;
				if(channel.type === ChannelType.DM && channel.users !== undefined) {
					let users = (channel.users as Array<User>).filter((value) => {
						return value.id !== RiotClient.user.id;
					});

					if(users[0] === undefined) {
						name = "Saved Messages";
						type = "self";
					} else {
						name = users[0].username;
						type = "dm";
						user = users[0];
					}
				}
				return Object.assign({}, prevState, {
					name, type, user,
					description: channel.description
				});
			});

			let messagesArray = await channel.fetchMessages();
			for (let message of messagesArray) {
				messages.set(message.id, message);
			}

			if(!this.mounted || props.channel !== channel.id) return;
			this.setState((prevState) => {
				this.scrollToBottom();
				return Object.assign({}, prevState, {
					messages
				});
			});
		} catch(e) {
			console.error(e);
		}
	}

	updateUser(user: User) {
		if(this.state.user === undefined || this.state.user.id !== user.id) return;
		this.setState((prevState) => {
			user
		});
	}

	onMessage(message: Message) {
		if(message.channel.id !== this.props.channel) return;
		this.setState((prevState, props) => {
			if(this.chatRef.current !== null) {
				let height = this.chatRef.current.clientHeight;
				let scrollHeight = this.chatRef.current.scrollHeight;
				if (this.scroll + height + 50 > scrollHeight) this.scrollToBottom();
			}

			let map = prevState.messages;
			map.set(message.id, message);
			return Object.assign({}, prevState, {
				messages: map
			});
		});
	}

	onSend(message: string): boolean {
		if(message == "") return false;
		RiotClient.fetchChannel(this.props.channel).then((channel) => {
			channel.send(message);
		});
		return true;
	}

	handleScroll(event: React.UIEvent<HTMLDivElement>) {
		this.scroll = (event.target as HTMLDivElement).scrollTop;
	}

	render() {
		let messageGroups: Array<React.ReactElement> = [];
		let currentMessageGroup: React.ReactElement | undefined = undefined;
		let dayYear = "0-0";

		this.state.messages.forEach((message) => {
			let messageDayYear = message.createdAt.getDay() + "-" + message.createdAt.getFullYear();
			let previousInvalid = currentMessageGroup === undefined
				|| currentMessageGroup.props.user === undefined
				|| currentMessageGroup.props.user.id !== message.author.id
				|| (currentMessageGroup.props.timestamp + (10 * 60 * 1000)) < message.createdAt.getTime()
				|| dayYear !== messageDayYear;
			if(previousInvalid) {
				if(currentMessageGroup !== undefined) messageGroups.push(currentMessageGroup);
				if(dayYear !== messageDayYear) {
					messageGroups.push(<MessageSeparator separation="timestamp" timestamp={message.createdAt} />);
					dayYear = messageDayYear;
				}
				currentMessageGroup = <MessageGroup key={`mg${message.id}`} user={message.author} timestamp={message.createdAt.getTime()} children={[]} />;
			}
			if(currentMessageGroup === undefined) return;

			currentMessageGroup.props.children.push(
				<MessageComponent key={`m${message.id}`} message={message} />
			);
		});

		if(currentMessageGroup !== undefined) messageGroups.push(currentMessageGroup);
		currentMessageGroup = undefined;

		return (
			<div className={css.root}>
				<div className={css.header}>
					<div className={css.items}>
						<div className={css.mobileMenu} onClick={(e) => { if(this.props.openDrawer) this.props.openDrawer("menu"); }}>
							<Icon icon="menu" type="regular" />
						</div>
						{ this.state.type === "chat" && <Icon className={css.icon} icon="chat" type="solid"/> }
						{ this.state.type === "dm" && <Icon className={css.icon} icon="at" type="regular"/> }
						{ this.state.type === "self" && <Icon className={css.icon} icon="inbox" type="regular"/> }
						{/* <div className={css.nameWrapper}> */}
							<div className={css.name}>{this.state.name}<div style={{width: "5px"}}/></div>
							{ this.state.type === "dm" && this.state.user &&
								<span className={`${css.indicator} ${this.state.user.status ? css[this.state.user.status.toLowerCase()] : ""}`}/> }
						{/* </div> */}
						{/*<span className={css.divider}/>*/}
						<div className={css.descWrapper}>
							<span className={css.divider}/>
                    		<div className={css.description}>{this.state.description}</div>
						</div>
					</div>
					<div className={css.menu}>
						{/*<Icon className={css.search} icon="search" type="regular"/>*/}
						<Icon className={css.menuIcon} icon="group"/>
                    	<Icon className={css.menuIcon} icon="bell"/>
						<Icon className={css.feedback} icon="megaphone"/>
					</div>
				</div>
				<div className={css.content} onScroll={this.handleScroll} ref={this.chatRef}>
					{messageGroups}
					<div ref={this.scrollToBottomRef} />
				</div>
				<div className={css.footer}>
					{/*<Snackbar
						text="hahayes"
						type="new"
						icon="check"
						iconType="regular"
						onDismiss={() => {}} />*/}
					<MessageBox channelName={this.state.name} channelType={this.state.type} onSend={this.onSend} />
				</div>
			</div>
		);
	}
}