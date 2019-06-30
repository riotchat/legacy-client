import * as React from 'react';
import { ChannelType } from 'riotchat.js/dist/api/v1/channels';
import { Message } from 'riotchat.js/dist/internal/Message';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import styles from './App.module.scss';

import HomeSidebar, { BaseChannels as HomeBaseChannels } from './components/section/home/Sidebar';
import ServerSidebar from './components/section/guild/Sidebar';
import Profile from './components/app/Profile';
import ServerIcon from './components/app/ServerIcon';
import Chat from './components/section/chat/Chat';
import { scrollable, hiddenScrollbar } from './components/util/Scrollbar';
import Icon from './components/util/Icon';
import FriendsList from './components/section/home/FriendsList';
import { RiotClient, focused } from './index';
import * as SFX from './sfx';

class App extends React.Component<{}, {
	drawer: undefined | "menu" | "members",
	section: "home" | string,
	channel: HomeBaseChannels | string,
	lastHomeChannel: HomeBaseChannels | string,
	screen: {width: number}
}> {
	theme: 'light' | 'dark';

	constructor(props: React.Props<{}>) {
		super(props);
		this.theme = 'dark';
		this.state = {
			drawer: undefined,
			section: "home",
			channel: "friends",
			lastHomeChannel: "friends",
			screen: { width: window.innerWidth }
		};

		this.openDrawer = this.openDrawer.bind(this);
		this.closeDrawer = this.closeDrawer.bind(this);
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.setSection = this.setSection.bind(this);
		this.setChannel = this.setChannel.bind(this);
		this.setDMChannel = this.setDMChannel.bind(this);
		this.onMessage = this.onMessage.bind(this);
	}

	componentDidMount() {
		RiotClient.on('message', this.onMessage);
		window.addEventListener("resize", this.updateWindowDimensions);
		this.updateWindowDimensions();
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

	updateWindowDimensions() {
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				screen: {
					width: window.innerWidth
				}
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

	async setDMChannel(userId: string) {
		let user = await RiotClient.fetchUser(userId);
		let channel = await user.openDM();
		this.setChannel(channel.id);
	}

	onMessage(message: Message) {
		if(message.channel.type !== ChannelType.DM && message.channel.type !== ChannelType.GROUP) return;
		if(message.channel.id === this.state.channel && focused) return;
		SFX.message();
	}

	render() {
		let test: Array<React.ReactNode> = [];
        for(let i = 0; i < 100; i++)
            test.push(<ServerIcon serverName="tech support scam time" iconURL="https://placeimg.com/240/240/nature" />);

		const sidebar = (
			<div className={styles.mainSidebars}>
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
					{this.state.section === "home" && <HomeSidebar channel={this.state.channel} onChangeChannel={this.setChannel} />}
					{this.state.section !== "home" && <ServerSidebar server={this.state.section} channel={this.state.channel} onChangeChannel={this.setChannel} />}
					<Profile />
				</div>
			</div>
		)

		let variant: "temporary" | "persistent" = this.state.screen.width > 900 ? "persistent" : "temporary";

		return (
			<div className={styles.root}>
				<div className={`${styles.drawerOpacity} ${this.state.drawer !== undefined ? styles.active : ""}`} onClick={this.closeDrawer} />
				<SwipeableDrawer
					variant={variant}
					onOpen={() => this.openDrawer("menu")}
					onClose={this.closeDrawer}
					open={variant === "temporary" ? (this.state.drawer === "menu") : true}
					swipeAreaWidth={30}
					disableBackdropTransition={true}
					disableSwipeToOpen={
						(typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !((navigator as any).standalone))
					}
					classes={{
						docked: styles.dockedMainSidebar,
						paper: styles.drawerPaper
					}}
				>
					{sidebar}
				</SwipeableDrawer>
				{ this.state.channel === "friends"
					? <FriendsList openDM={this.setDMChannel} openDrawer={this.openDrawer} />
					: <Chat channel={this.state.channel} openDrawer={this.openDrawer} /> }
			</div>
		)
	}
}
	
export default App;