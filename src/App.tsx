import * as React from 'react';
import { ChannelType } from 'riotchat.js/dist/api/v1/channels';
import { Message } from 'riotchat.js/dist/internal/Message';

import styles from './App.module.scss';

import HomeSidebar, { BaseChannels as HomeBaseChannels } from './components/section/home/Sidebar';
import ServerSidebar from './components/section/guild/Sidebar';
import Profile from './components/app/Profile';
import ServerIcon from './components/app/ServerIcon';
import Chat from './components/section/chat/Chat';
import { scrollable, hiddenScrollbar } from './components/util/Scrollbar';
import Icon from './components/util/Icon';
import FriendsList from './components/section/home/FriendsList';
import { RiotClient } from './index';
import * as SFX from './sfx';

class App extends React.Component<{}, {
	drawer: undefined | "menu" | "members",
	section: "home" | string,
	channel: HomeBaseChannels | string,
	lastHomeChannel: HomeBaseChannels | string
}> {
	theme: 'light' | 'dark';

	constructor(props: React.Props<{}>) {
		super(props);
		this.theme = 'dark';
		this.state = {
			drawer: undefined,
			section: "home",
			channel: "friends",
			lastHomeChannel: "friends"
		};

		this.openDrawer = this.openDrawer.bind(this);
		this.closeDrawer = this.closeDrawer.bind(this);
		this.setSection = this.setSection.bind(this);
		this.setChannel = this.setChannel.bind(this);
		this.onMessage = this.onMessage.bind(this);
	}

	componentDidMount() {
		RiotClient.on('message', this.onMessage);
	}

	componentWillUnmount() {
		RiotClient.removeListener('message', this.onMessage);
	}

	openDrawer(drawer: "menu" | "members") {
		this.setState((prevState, props) => {
			return Object.assign({}, prevState, {
				drawer
			});
		});
	}

	closeDrawer() {
		this.setState((prevState, props) => {
			return Object.assign({}, prevState, {
				drawer: undefined
			});
		});
	}

	setSection(section: string) {
		this.setState((prevState, props) => {
			return Object.assign({}, prevState, {
				section,
				channel: section === "home" ? prevState.lastHomeChannel : prevState.channel
			});
		});
	}
	
	setChannel(channel: string) {
		this.closeDrawer();
		this.setState((prevState, props) => {
			return Object.assign({}, prevState, {
				channel,
				lastHomeChannel: prevState.section === "home" ? channel : prevState.lastHomeChannel,
			});
		});
	}

	onMessage(message: Message) {
		if(message.channel.type !== ChannelType.DM && message.channel.type !== ChannelType.GROUP) return;
		if(message.channel.id === this.state.channel) return;
		SFX.message();
	}

	render() {
		let test: Array<React.ReactNode> = [];
        for(let i = 0; i < 100; i++)
            test.push(<ServerIcon serverName="tech support scam time" iconURL="https://placeimg.com/240/240/nature" />);

		return (
			<div className={styles.root}>
				<div className={`${styles.drawerOpacity} ${this.state.drawer !== undefined ? styles.active : ""}`} onClick={this.closeDrawer} />
				<div className={`${styles.mainSidebars} ${this.state.drawer === "menu" ? styles.open : ""}`}>
					<div className={`${styles.sidebar} ${styles.main}`}>
						<div className={`${styles.guilds} ${hiddenScrollbar}`}>
							<div className={`${styles.home} ${this.state.section === "home" ? styles.active : ""}`} onClick={(e) => this.setSection("home")}>
								<Icon icon="home" />
							</div>
							<div className={styles.divider} />
							{test}
							<div className={styles.filler}></div>
						</div>
						<div className={styles.add}>
							<Icon icon="plus" type="regular" />
						</div>
					</div>
					<div className={`${styles.sidebar} ${styles.browser}`}>
						{ this.state.section === "home" && <HomeSidebar channel={this.state.channel} onChangeChannel={this.setChannel} /> }
						{ this.state.section !== "home" && <ServerSidebar server={this.state.section} channel={this.state.channel} onChangeChannel={this.setChannel} /> }
						<Profile />
					</div>
				</div>
				{ this.state.channel === "friends"
					? <FriendsList openDrawer={this.openDrawer} />
					: <Chat channel={this.state.channel} openDrawer={this.openDrawer} /> }
			</div>
		)
	}
}
	
export default App;