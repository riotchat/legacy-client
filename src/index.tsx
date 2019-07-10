import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import { EventEmitter } from 'events';

import './index.html';
import './sass/accessibility.scss';
import App from './App';
import * as Riot from 'riotchat.js';
import { isLight, hexToRgb, shadeColor, ClientOptions } from './utilFuctions';
import { StreamerMode, ThemeInfo, OptionsComponent, AccessibilityOptions } from './components/util/ExtendableComponent';
import { Input, Checkbox, RadioGroup } from './components/util/FormComponents';

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

function setAccessibility(accessibility: AccessibilityOptions) {
	document.body.setAttribute('accessibility', `${accessibility.colorblind ? "colorblind " : ""}${accessibility.outlines ? "outlines " : ""}`
		+ `${accessibility.highlight ? "highlight " : ""}${accessibility.bold ? "bold " : ""}${accessibility.noAnimations ? "noAnimations" : ""}`);
}

class PreApp extends OptionsComponent<{}, {loginState: "loggedIn" | "loggingIn" | "noToken" | "connectionError", email: string, password: string, checkboxOne?: number, checkboxTwo: number}> {
	mounted: boolean;
	constructor(props: {}) {
		super(props);
		this.mounted = false;
		let loginState: any = localStorage.getItem("token") != null ? "loggingIn" : "noToken";
		if(loggedIn) loginState = "loggedIn";
		this.state = Object.assign({}, this.state, {
			loginState,
			email: "",
			password: "",
			checkboxOne: undefined,
			checkboxTwo: 1
		});

		setAccessibility(this.state.options.accessibility);
		document.body.setAttribute('theme', this.state.options.themeInfo.theme.toLowerCase() + (this.state.options.accessibility.highContrast ? "-hc" : ""));
		this.onOptionsUpdate = this.onOptionsUpdate.bind(this);

		this.changeEmail = this.changeEmail.bind(this);
		this.changePassword = this.changePassword.bind(this);
		this.loginWithCredentials = this.loginWithCredentials.bind(this);
		this.successfulLogin = this.successfulLogin.bind(this);
		this.error = this.error.bind(this);
		this.radioTestToggle = this.radioTestToggle.bind(this);
	}

	async componentDidMount() {
		super.componentDidMount();

		this.mounted = true;
		RiotClient.on('connected', this.successfulLogin);
		RiotClient.on('error', this.error);
		let token = localStorage.getItem("token");
		if(token != null) {
			RiotClient.login(token);
		}
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		RiotClient.removeListener('connected', this.successfulLogin);
		RiotClient.removeListener('error', this.error);
		this.mounted = false;
	}

	onOptionsUpdate(options: ClientOptions) {
		this.setState((prevState) => {
			document.body.setAttribute('theme', options.themeInfo.theme.toLowerCase() + (options.accessibility.highContrast ? "-hc" : ""));
			setAccessibility(options.accessibility);
			localStorage.setItem('options', JSON.stringify(options));
			return Object.assign({}, prevState, { options });
		});
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

	radioTestToggle(checkboxGroup: number, checkbox: number) {
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				[checkboxGroup === 1 ? "checkboxOne" : "checkboxTwo"]: checkbox
			});
		});
	}

	render() {
		let accent = this.state.options.themeInfo.accent;
		if(this.state.options.accessibility.highContrast) accent = this.state.options.themeInfo.theme === "dark" ? "FFFFFF" : "000000";
		let hexAccent = `#${accent}`;
		let accentRGB = hexToRgb(accent);
		if(this.state.loginState === "loggedIn") {
			return (
				<React.Fragment>
					<Helmet>
						<meta key="metaViewport" name="viewport"
							content={`width=device-width, initial-scale=0.9, user-scalable=${this.state.options.accessibility.pinchToZoom ? "yes" : "no"}`} />	
						{ this.state.options.themeInfo.theme === "dark" && !this.state.options.accessibility.highContrast
							&& <meta key="metaTheme" name="theme-color" content="#333234" /> }
						{ this.state.options.themeInfo.theme === "dark" && this.state.options.accessibility.highContrast
							&& <meta key="metaTheme" name="theme-color" content="#000000" /> }
						{ this.state.options.themeInfo.theme === "light" && !this.state.options.accessibility.highContrast
							&& <meta key="metaTheme" name="theme-color" content="#FBFBFB" /> }
						{ this.state.options.themeInfo.theme === "light" && this.state.options.accessibility.highContrast
							&& <meta key="metaTheme" name="theme-color" content="#FFFFFF" /> }
					</Helmet>
					<style>{`
						:root {
							--accent-color: ${hexAccent};
							--accent-color-rgb: ${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b};
							--accent-color-darken-10: ${shadeColor(hexAccent, -10)};
							--accent-color-darken-5: ${shadeColor(hexAccent, -5)};
							--accent-color-lighten-5: ${shadeColor(hexAccent, 5)};
							--accent-color-lighten-10: ${shadeColor(hexAccent, 10)};
							--accent-color-text: ${isLight(accentRGB.r, accentRGB.g, accentRGB.b) ? "black" : "white"}
						}
					`}</style>
					{this.props.children}
				</React.Fragment>
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