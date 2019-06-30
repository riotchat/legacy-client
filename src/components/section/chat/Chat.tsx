import * as React from 'react';

import styles from './Chat.module.scss';
import Icon from '../../util/Icon';
import MessageBox from './MessageBox';
import Snackbar from './Snackbar';

import MessageGroup from './MessageGroup';
import MessageComponent from './Message';

import { Message } from 'riotchat.js/dist/internal/Message';
import { RiotClient } from '../../..';
import { ChannelType } from 'riotchat.js/dist/api/v1/channels';
import { User } from 'riotchat.js';

type ChatProps = {
	channel: string,
	openDrawer?: (drawer: "menu" | "members") => void
}

export default class Chat extends React.Component<ChatProps, { scroll: number, name: string, type: "chat" | "dm" | "self", description: string, messages: Array<Message> }> {
	mounted: boolean;
	chatRef: React.RefObject<HTMLDivElement>;
	scrollToBottomRef: React.RefObject<HTMLDivElement>;
	constructor(props: ChatProps) {
		super(props);
		this.mounted = false;
		this.chatRef = React.createRef();
		this.scrollToBottomRef = React.createRef();
		this.state = {
			description: "",
			messages: [],
			scroll: 0,
			name: "",
			type: "chat"
		}

		this.scrollToBottom = this.scrollToBottom.bind(this);
		this.reloadChannel = this.reloadChannel.bind(this);
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
		this.reloadChannel(this.props);
		(window as any).chatRef = this.chatRef;
	}

	componentWillUnmount() {
		this.mounted = false;
		RiotClient.removeListener('message', this.onMessage);
		(window as any).chatRef = undefined;
	}

	componentWillReceiveProps(props: ChatProps) {
		if(this.props.channel !== props.channel) this.reloadChannel(props);
	}

	async reloadChannel(props: ChatProps) {
		if(!this.mounted) return;
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				name: "",
				type: "chat",
				description: "",
				messages: [],
				scroll: 0,
			});
		});
		try {
			let channel = await RiotClient.fetchChannel(props.channel);
			this.setState((prevState) => {
				let name = "insert implement fucking channel names";
				let type = "chat";
				if (channel.type === ChannelType.DM && channel.users !== undefined) {
					let users = (channel.users as Array<User>).filter((value) => {
						return value.id !== RiotClient.user.id;
					});

					if(users[0] === undefined) {
						name = "Saved Messages";
						type = "self";
					} else {
						name = users[0].username;
						type = "dm";
					}
				}
				return Object.assign({}, prevState, {
					name, type,
					description: channel.description
				});
			});
			let messages = await channel.fetchMessages();
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

	onMessage(message: Message) {
		if(message.channel.id !== this.props.channel) return;
		this.setState((prevState, props) => {
			if(this.chatRef.current !== null) {
				let height = this.chatRef.current.clientHeight;
				let scrollHeight = this.chatRef.current.scrollHeight;
				if(prevState.scroll + height + 50 > scrollHeight) this.scrollToBottom();
			}

			return Object.assign({}, prevState, {
				messages: prevState.messages.concat([ message ]),
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
		let target = event.target as HTMLDivElement;
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				scroll: target.scrollTop
			});
		});
	}

	render() {
		let messageGroups: Array<React.ReactElement> = [];
		let currentMessageGroup: React.ReactElement | undefined = undefined;

		this.state.messages.forEach((message) => {
			let previousInvalid = currentMessageGroup === undefined
				|| currentMessageGroup.props.user === undefined
				|| currentMessageGroup.props.user.id !== message.author.id
				|| (currentMessageGroup.props.timestamp + (10 * 60 * 1000)) < message.createdAt.getTime();
			if(previousInvalid) {
				if(currentMessageGroup !== undefined) messageGroups.push(currentMessageGroup);
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
			<div className={styles.root}>
				<div className={styles.header}>
					<div className={styles.items}>
						<div className={styles.mobileMenu} onClick={(e) => { if(this.props.openDrawer) this.props.openDrawer("menu"); }}>
							<Icon icon="menu" type="regular" />
						</div>
						{ this.state.type === "chat" && <Icon className={styles.icon} icon="chat" type="solid"/> }
						{ this.state.type === "dm" && <Icon className={styles.icon} icon="at" type="regular" /> }
						{ this.state.type === "self" && <Icon className={styles.icon} icon="inbox" type="regular" /> }
						{/* <div className={styles.nameWrapper}> */}
							<div className={styles.name}>{this.state.name}<div style={{width: "5px"}} /></div>
						{/* </div> */}
						<span className={styles.divider}/>
						<div className={styles.descWrapper}>
                    		<div className={styles.description}>{this.state.description}</div>
						</div>
					</div>
					<div className={styles.menu}>
						{/*<Icon className={styles.search} icon="search" type="regular"/>*/}
						<Icon className={styles.menuIcon} icon="group"/>
                    	<Icon className={styles.menuIcon} icon="bell"/>
						<Icon className={styles.feedback} icon="megaphone"/>
					</div>
				</div>
				<div className={styles.content} onScroll={this.handleScroll} ref={this.chatRef}>
					{messageGroups}
					<div ref={this.scrollToBottomRef} />
				</div>
				<div className={styles.footer}>
					{/*<Snackbar
						text="hahayes"
						type="new"
						icon="check"
						iconType="regular"
						onDismiss={() => {}} />*/}
					<MessageBox onSend={this.onSend} />
				</div>
			</div>
		);
	}
}