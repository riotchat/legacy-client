import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EventEmitter } from 'events';

import './index.html';
import App from './App';
import * as Riot from 'riotchat.js';
import { StreamerMode, ThemeInfo } from './components/util/ExtendableComponent';

let pubsub = new EventEmitter();

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

let streamerMode: StreamerMode = { enabled: false };
pubsub.on('streamerMode', (_) => streamerMode = _ );

export { pubsub, RiotClient, focused, streamerMode };
(window as any).RiotClient = RiotClient;

// https://stackoverflow.com/a/13532993
function shadeColor(color: string, percent: number) {
    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
	var B = parseInt(color.substring(5,7),16);
	
    R = Math.floor(R * (100 + percent) / 100);
    G =	Math.floor(G * (100 + percent) / 100);
	B = Math.floor(B * (100 + percent) / 100);
	
    R = (R<255) ? ((R > 0) ? R : 0) : 255;
    G = (G<255) ? ((G > 0) ? G : 0) : 255;
	B = (B<255) ? ((B > 0) ? B : 0) : 255;
	
    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

// https://stackoverflow.com/a/5624139
function hexToRgb(hex: string): { r: number, g: number, b: number } {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : { r: 0, g: 0, b: 0 };
}

// https://awik.io/determine-color-bright-dark-using-javascript/
function isLight(r: number, g: number, b: number): boolean {
    let hsp;

    // HSP equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    return hsp > 140;
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
			localStorage.setItem("themeInfo", JSON.stringify(themeInfo));
		}
		this.state = {
			loginState,
			email: "",
			password: "",
			themeInfo
		}

		document.body.setAttribute('theme', themeInfo.theme.toLowerCase());

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
			localStorage.setItem("themeInfo", JSON.stringify(themeInfo));
			document.body.setAttribute('theme', themeInfo.theme.toLowerCase());
			return Object.assign({}, prevState, {
				themeInfo
			});
		});
	}

	render() {
		let hexAccent = `#${this.state.themeInfo.accent}`;
		let accent = hexToRgb(this.state.themeInfo.accent);
		if(this.state.loginState === "loggedIn") {
			return (
				<div className={`theme--${this.state.themeInfo.theme}`}>
					<style>{`
						:root {
							--accent-color: ${hexAccent};
							--accent-color-darken-10: ${shadeColor(hexAccent, -10)};
							--accent-color-darken-5: ${shadeColor(hexAccent, -5)};
							--accent-color-lighten-5: ${shadeColor(hexAccent, 5)};
							--accent-color-lighten-10: ${shadeColor(hexAccent, 10)};
							--accent-color-text: ${isLight(accent.r, accent.g, accent.b) ? "black" : "white"}
						}
					`}</style>
					{this.props.children}
				</div>
			);
		} else return (
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