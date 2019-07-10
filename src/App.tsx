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
import { RiotClient, focused, pubsub } from './index';
import * as SFX from './sfx';
import ErrorBoundary from './components/util/ErrorBoundary';
import SettingsPanel, { SettingsPanelTabs } from './components/app/Settings';
import { DMChannel, GroupChannel } from 'riotchat.js/dist/internal/Channel';
import NewsTab from './components/section/home/News';

class App extends React.Component<{}, {
	drawer: undefined | "menu" | "members",
	section: "home" | string,
	channel: HomeBaseChannels | string,
	lastHomeChannel: HomeBaseChannels | string,
	screen: {width: number},
	settingsPanel: {
		open: boolean,
		tab: SettingsPanelTabs
	}
}> {
	canNotify: boolean;
	theme: 'light' | 'dark';

	constructor(props: React.Props<{}>) {
		super(props);
		this.canNotify = false;
		this.theme = 'dark';
		this.state = {
			drawer: undefined,
			section: "home",
			channel: "friends",
			lastHomeChannel: "friends",
			screen: { width: window.innerWidth },
			settingsPanel: { open: false, tab: undefined }
		};

		this.openDrawer = this.openDrawer.bind(this);
		this.closeDrawer = this.closeDrawer.bind(this);

		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.onMessage = this.onMessage.bind(this);

		this.setSection = this.setSection.bind(this);
		this.setChannel = this.setChannel.bind(this);
		this.setDMChannel = this.setDMChannel.bind(this);

		this.openSettings = this.openSettings.bind(this);
		this.closeSettings = this.closeSettings.bind(this);
	}

	componentDidMount() {
		if ("Notification" in window) {
			Notification.requestPermission(result => {
				if (result === 'granted') {
					this.canNotify = true;
				}
			});
		}

		RiotClient.on('message', this.onMessage);
		window.addEventListener('resize', this.updateWindowDimensions);
		pubsub.on('openSettings', this.openSettings);
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
		if(message.author.id === RiotClient.user.id) return;
		if(!(message.channel instanceof DMChannel) && !(message.channel instanceof GroupChannel)) return;
		if(message.channel.id === this.state.channel && focused && !this.state.settingsPanel.open) return;

		if (this.canNotify) {
			let notification = new Notification(message.author.username, {
				body: message.content.substr(0, 32),
				icon: message.author.avatarURL,
				silent: true
			});

			notification.onclick = () => {
				this.setSection("home");
				this.setChannel(message.channel.id);
				window.focus();
			}

			setTimeout(notification.close.bind(notification), 4000);
		}

		SFX.message();
	}

	openSettings(tab?: SettingsPanelTabs) {
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				settingsPanel: {
					open: true,
					tab
				}
			});
		});
	}

	closeSettings() {
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				settingsPanel: {
					open: false
				}
			});
		});
	}

	render() {
		const sidebar = (
			<div className={styles.mainSidebars}>
				<div className={`${styles.sidebar} ${styles.main}`}>
					<div className={`${styles.guilds} ${hiddenScrollbar}`}>
						<div className={`${styles.home} ${this.state.section === "home" ? styles.active : ""}`} onClick={(e) => this.setSection("home")}>
							<Icon icon="home" />
						</div>
						<div className={styles.divider} />
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
			<div>
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
					{ this.state.channel === "friends" && <FriendsList openDM={this.setDMChannel} openDrawer={this.openDrawer} /> }
					{ this.state.channel === "news" && <NewsTab /> }
					{ this.state.channel !== "feed" && this.state.channel !== "news" && this.state.channel !== "friends" && (
							<ErrorBoundary customMessage="chat crashed, blame fatal">
								<Chat channel={this.state.channel} openDrawer={this.openDrawer} />
							</ErrorBoundary>
					)}
				</div>
				<SettingsPanel open={this.state.settingsPanel.open} tab={this.state.settingsPanel.tab} onClose={this.closeSettings} onSwitchTab={this.openSettings} />
			</div>
		)
	}
}
	
export default App;