import * as React from 'react';

import styles from './Chat.module.scss';
import Icon from '../../util/Icon';
import MessageBox from './MessageBox';
import Snackbar from './Snackbar';

import MessageGroup from './MessageGroup';
import MessageComponent from './Message';

import { Message } from 'riotchat.js/dist/internal/Message';
import { RiotClient } from '../../..';
import ScrollIntoView from '../../util/ScrollIntoView';

type ChatProps = {
	channel: string,
	openDrawer?: (drawer: "menu" | "members") => void
}

export default class Chat extends React.Component<ChatProps, { scroll: number, scrollToBottom: boolean, description: string, messages: Array<Message> }> {
	mounted: boolean;
	chatRef: React.RefObject<HTMLDivElement>;
	constructor(props: ChatProps) {
		super(props);
		this.mounted = false;
		this.chatRef = React.createRef();
		this.state = {
			description: "",
			messages: [],
			scroll: 0,
			scrollToBottom: true
		}

		this.reloadChannel = this.reloadChannel.bind(this);
		this.onMessage = this.onMessage.bind(this);
		this.onSend = this.onSend.bind(this);
	}

	componentDidMount() {
		this.mounted = true;
		RiotClient.on('message', this.onMessage);
		this.reloadChannel(this.props);
	}

	componentWillUnmount() {
		this.mounted = false;
		RiotClient.removeListener('message', this.onMessage);
	}

	componentWillReceiveProps(props: ChatProps) {
		console.log("existing", this.props);
		console.log("receiving", props);
		if(this.props.channel !== props.channel) this.reloadChannel(props);
	}

	async reloadChannel(props: ChatProps) {
		if(!this.mounted) return;
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				description: "",
				messages: [],
				scroll: 0,
				scrollToBottom: true
			});
		});
		try {
			let channel = await RiotClient.fetchChannel(props.channel);
			let messages = await channel.fetchMessages();
			if(!this.mounted || props.channel !== channel.id) return;
			this.setState((prevState) => {
				return Object.assign({}, prevState, {
					description: channel.description,
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
			let scrollToBottom = false;
			if(this.chatRef.current !== null) {
				let height = this.chatRef.current.clientHeight;
				let scrollHeight = this.chatRef.current.scrollHeight;
				if(prevState.scroll + height + 15 > scrollHeight) scrollToBottom = true;
			}

			return Object.assign({}, prevState, {
				messages: prevState.messages.concat([ message ]),
				scrollToBottom
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
				|| currentMessageGroup.props.user.id !== message.author.id;
			if(previousInvalid) {
				if(currentMessageGroup !== undefined) messageGroups.push(currentMessageGroup);
				currentMessageGroup = <MessageGroup key={`mg${message.id}`} user={message.author} children={[]} />;
			}
			if(currentMessageGroup === undefined) return;

			currentMessageGroup.props.children.push(
				<MessageComponent message={message} />
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
						<Icon className={styles.icon} icon="chat" />
						{/* <div className={styles.nameWrapper}> */}
							<div className={styles.name}>a name i guess</div>
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
					{/* <MessageGroup timestamp={1561287828} username="nizune" pfpURL="/assets/images/nizune.png">
						<Message>
							{`my name jeff`}
						</Message>
					</MessageGroup>
					<MessageGroup timestamp={1561287851} username="FatalErrorCoded" pfpURL="/assets/images/fatalerrorcoded.png">
						<Message>
							{`Hey nizune!`}
						</Message>
					</MessageGroup>
					<MessageGroup timestamp={1561287868} username="tech support scammer" pfpURL="https://owo.insrt.uk/rDWrK7q0XJ8MpKdHFPP-Q.png">
						<Message>
							{`Haha **yes**!\ntime to\nscam some\n\npeople`}
						</Message>
					</MessageGroup>
					<MessageGroup timestamp={1561290160} username="FatalErrorCoded" pfpURL="/assets/images/fatalerrorcoded.png">
						<Message>
							{`Test`}
						</Message>
						<Message>
							{`Single\nLine break`}
						</Message>
						<Message>
							{`Double\n\nLine break`}
						</Message>
						<Message>
							{`# Level 1\n## Level 2\n### Level 3\n#### Level 4\n##### Level 5\n###### Level 6`}
						</Message>
						<Message>
							{`> Block Quotes\n>Now this is great\n> - almighty fatal\n> > also you can have block quotes inside block quotes cause why the heck not`}
						</Message>
					</MessageGroup>
					<MessageGroup timestamp={1561304582} username="FatalErrorCoded" pfpURL="/assets/images/fatalerrorcoded.png">
						<Message>
							{`Testing links https://marked.js.org/#/USING_ADVANCED.md#options`}
						</Message>
						<Message>
							{`<b>This should be sanitized</b><script>alert('this is NOT sanitized!')</script>`}
						</Message>
					</MessageGroup>
					<MessageGroup timestamp={1561305347} username="nizune" pfpURL="/assets/images/nizune.png">
						<Message>
							{`here's a link to test: https://www.youtube.com/watch?v=dQw4w9WgXcQ`}
						</Message>
					</MessageGroup>
					<MessageGroup timestamp={1561305844} username="FatalErrorCoded" pfpURL="/assets/images/fatalerrorcoded.png">
						<Message>
							{`[Another link which should NOT work outside of embeds](https://i.kym-cdn.com/photos/images/newsfeed/001/170/001/c44.png)`}
						</Message>
						<Message>
							{`# [Link in a heading](https://i.kym-cdn.com/photos/images/newsfeed/001/170/001/c44.png)`}
						</Message>
					</MessageGroup> */}
					{messageGroups}
					{messageGroups.length !== 0 && (
						<ScrollIntoView scroll={this.state.scrollToBottom} onScrolled={
							() => this.setState((prevState) => {
								return Object.assign({}, prevState, {
									scrollToBottom: false
								});
							}
						)} />
					)}
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