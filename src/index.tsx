import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EventEmitter } from 'events';

import './index.html';
import App from './App';
import * as Riot from 'riotchat.js';

let RiotClient = new Riot.Client();
let loggedIn = false;
RiotClient.on('connected', () => {
	console.log(`Logged in as ${RiotClient.user.username}`);
	loggedIn = true;
	localStorage.setItem("token", (RiotClient as any).accessToken);
})

let focused = true;
window.onfocus = () => focused = true;
window.onblur = () => focused = false;
let pubsub = new EventEmitter();

export { RiotClient, focused, pubsub };
(window as any).RiotClient = RiotClient;

type ThemeInfo = {
	theme: "dark" | "light",
	accent: string
}

class PreApp extends React.Component<{}, {loginState: "loggedIn" | "loggingIn" | "noToken" | "connectionError", email: string, password: string, themeInfo: ThemeInfo}> {
	mounted: boolean;
	constructor(props: {}) {
		super(props);
		this.mounted = false;
		let loginState: any = localStorage.getItem("token") != null ? "loggingIn" : "noToken";
		if(loggedIn) loginState = "loggedIn";
		let themeInfo: ThemeInfo | undefined = localStorage.getItem("themeInfo") ? JSON.parse(localStorage.getItem("themeInfo") as any) : undefined;
		if(!themeInfo) {
			themeInfo = {
				theme: "dark",
				accent: "7B68EE"
			}
		}
		this.state = {
			loginState,
			email: "",
			password: "",
			themeInfo
		}

		this.changeEmail = this.changeEmail.bind(this);
		this.changePassword = this.changePassword.bind(this);
		this.loginWithCredentials = this.loginWithCredentials.bind(this);
		this.successfulLogin = this.successfulLogin.bind(this);
		this.error = this.error.bind(this);
		this.updateTheme = this.updateTheme.bind(this);
	}

	async componentDidMount() {
		this.mounted = true;
		RiotClient.on('connected', this.successfulLogin);
		RiotClient.on('error', this.error);
		pubsub.on('updateTheme', this.updateTheme);
		let token = localStorage.getItem("token");
		if(token != null) {
			RiotClient.login(token);
		}
	}

	componentWillUnmount() {
		RiotClient.removeListener('connected', this.successfulLogin);
		RiotClient.removeListener('error', this.error);
		pubsub.removeListener('updateTheme', this.updateTheme);
		this.mounted = false;
	}

	changeEmail(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState(Object.assign({}, this.state, {
			email: event.target.value
		}));
	}

	changePassword(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState(Object.assign({}, this.state, {
			password: event.target.value
		}));
	}

	async loginWithCredentials(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if(!this.mounted) return;

		this.setState(Object.assign({}, this.state, {
			loginState: "loggingIn",
			email: "",
			password: ""
		}));

		RiotClient.login(this.state.email, this.state.password);
	}

	successfulLogin() {
		if(!this.mounted) return;
		this.setState(Object.assign({}, this.state, {
			loginState: "loggedIn",
			email: "",
			password: ""
		}));
	}

	error() {
		if(!this.mounted || this.state.loginState === "loggedIn") return;
		this.setState(Object.assign({}, this.state, {
			loginState: "connectionError",
			email: "",
			password: ""
		}));
	}

	updateTheme(themeInfo: ThemeInfo) {
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				themeInfo
			});
		});
	}

	render() {
		if(this.state.loginState === "loggedIn") return (
			<div className={`theme--${this.state.themeInfo.theme}`}>
				<style>{`
					:root {
						--accent-color: #${this.state.themeInfo.accent};
					}
				`}</style>
				{this.props.children}
			</div>
		);
		else return (
			<div style={{ margin: "20px", color: "white" }}>
				{this.state.loginState === "noToken" && (
					<div>
						<h3>Not logged in</h3>
						<form onSubmit={this.loginWithCredentials}>
							<input type="email" placeholder="Email" value={this.state.email} onChange={this.changeEmail} /><br />
							<input type="password" placeholder="Password" value={this.state.password} onChange={this.changePassword} /><br />
							<input type="submit" value="Login" />
						</form>
					</div>
				)}
				{ this.state.loginState === "loggingIn" && (
					<div>
						<h3>Logging in</h3><br /><br />
						<button onClick={() => { localStorage.removeItem("token"); window.location.reload() }}>Re-login</button>
					</div>
				)}
				{ this.state.loginState === "connectionError" && (
					<div>
						<h2>Connection error</h2><br /><br />
						<button onClick={() => window.location.reload()}>Retry</button><br/><br/>
						<button onClick={() => { localStorage.removeItem("token"); window.location.reload() }}>Re-login</button>
					</div>
				)}
			</div>
		);
	}
}

ReactDOM.render(
	<PreApp>
		<App />
	</PreApp>,
	document.getElementById('app')
);