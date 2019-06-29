import * as React from 'react';
import * as ReactDOM from 'react-dom';

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

export { RiotClient };

class PreApp extends React.Component<{}, {loginState: "loggedIn" | "loggingIn" | "noToken" | "connectionError", email: string, password: string}> {
	mounted: boolean;
	constructor(props: {}) {
		super(props);
		this.mounted = false;
		let loginState: any = localStorage.getItem("token") != null ? "loggingIn" : "noToken";
		if(loggedIn) loginState = "loggedIn";
		this.state = {
			loginState,
			email: "",
			password: ""
		}

		this.changeEmail = this.changeEmail.bind(this);
		this.changePassword = this.changePassword.bind(this);
		this.loginWithCredentials = this.loginWithCredentials.bind(this);

		RiotClient.on('connected', () => {
			if(!this.mounted) return;
			this.setState(Object.assign({}, this.state, {
				loginState: "loggedIn",
				email: "",
				password: ""
			}));
		});
	}

	componentDidMount() {
		this.mounted = true;
		let token = localStorage.getItem("token");
		if(token != null) {
			RiotClient.login(token);
		}
	}

	componentWillUnmount() {
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

	loginWithCredentials(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if(!this.mounted) return;
		RiotClient.login(this.state.email, this.state.password);

		this.setState(Object.assign({}, this.state, {
			loginState: "loggingIn",
			email: "",
			password: ""
		}));
	}

	render() {
		if(this.state.loginState === "loggedIn") return this.props.children;
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
					<h3>Logging in</h3>
				)}
				{ this.state.loginState === "connectionError" && (
					<h2>Connection error</h2>
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