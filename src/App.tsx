import * as React from 'react';

import styles from './App.module.scss';

import HomeSidebar, { BaseChannels as HomeBaseChannels } from './components/section/home/Sidebar';
import ServerSidebar from './components/section/guild/Sidebar';
import Profile from './components/app/Profile';
import ServerIcon from './components/app/ServerIcon';
import Chat from './components/section/chat/Chat';
import { scrollable, hiddenScrollbar } from './components/util/Scrollbar';
import Icon from './components/util/Icon';
import FriendsList from './components/section/home/FriendsList';

//import * as RiotJs from '../../riot.js';
//let RiotClient = new RiotJs.Client();

const mode: "home" | "server" = "home";

class App extends React.Component<{}, {
	drawer: undefined | "menu" | "members",
	section: "home" | string,
	channel: HomeBaseChannels | string,
	lastHomeChannel: HomeBaseChannels | string,
	loginState: "notoken" | "loggingin" | "loggedin"
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
			loginState: "loggedin" //localStorage.getItem("token") != undefined ? "loggingin" : "notoken"
		};

		this.openDrawer = this.openDrawer.bind(this);
		this.closeDrawer = this.closeDrawer.bind(this);
		this.setSection = this.setSection.bind(this);
		this.setChannel = this.setChannel.bind(this);
	}

	/*componentDidMount() {
		RiotClient.on('connected', () => {
			this.setState({
				drawer: this.state.drawer,
				section: this.state.section,
				channel: this.state.channel,
				lastHomeChannel: this.state.lastHomeChannel,
				loginState: "loggedin"
			});
		})
		if(localStorage.getItem("token") != undefined) {
			RiotClient.login(localStorage.getItem("token") as string);
		}
	}*/

	openDrawer(drawer: "menu" | "members") {
		this.setState({
			drawer,
			section: this.state.section,
			channel: this.state.channel,
			lastHomeChannel: this.state.lastHomeChannel,
			loginState: this.state.loginState
		});
	}

	closeDrawer() {
		this.setState({
			drawer: undefined,
			section: this.state.section,
			channel: this.state.channel,
			lastHomeChannel: this.state.lastHomeChannel,
			loginState: this.state.loginState
		});
	}

	setSection(section: string) {
		this.setState({
			drawer: this.state.drawer,
			section,
			channel: section === "home" ? this.state.lastHomeChannel : this.state.channel,
			lastHomeChannel: this.state.lastHomeChannel,
			loginState: this.state.loginState
		});
	}
	
	setChannel(channel: string) {
		this.setState({
			drawer: this.state.drawer,
			section: this.state.section,
			channel,
			lastHomeChannel: this.state.section === "home" ? channel : this.state.lastHomeChannel,
			loginState: this.state.loginState
		});
	}

	render() {
		let test: Array<React.ReactNode> = [];
        for(let i = 0; i < 100; i++)
            test.push(<ServerIcon serverName="tech support scam time" iconURL="https://placeimg.com/240/240/nature" />);

		if(this.state.loginState !== "loggedin") return (
			<div className={styles.root}>
				<div style={{ padding: "20px", color: "white" }}>
					{this.state.loginState === "loggingin" ? (
						<h1>Logging in...</h1>
					) : (
						<div>
							<h3>Token not found in local storage!</h3>
							<h5>Set <pre style={{ display: "inline" }}>token</pre> in local storage to your user token</h5>
							<br />
							<h5>Use this form to register and get a token for now</h5>
							<form action="86.11.153.158:3000/api/v1/auth/create" encType="application/x-www-form-urlencoded" method="POST">
								<input type="text" placeholder="Username" name="username" /><br />
								<input type="password" placeholder="Password" name="password" /><br />
								<input type="email" placeholder="Email" name="email" /><br />
								<input type="submit"/>
							</form>
							<br />
							<h5>Or this form to "login" and get a token</h5>
							<form action="86.11.153.158:3000/api/v1/auth/authenticate" encType="application/x-www-form-urlencoded" method="GET">
								<input type="email" placeholder="Email" name="email" /><br />
								<input type="password" placeholder="Password" name="password" /><br />
								<input type="submit"/>
							</form>
						</div>
					)}
				</div>
			</div>
		); else return (
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
						<Profile username="my name jeff" status="Away" avatarURL="https://placeimg.com/240/240/nature" />
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