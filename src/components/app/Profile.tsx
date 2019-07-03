/**
 * Profile widget for displaying user status
 * @namespace profile
 */

import * as React from 'react';
import styles from './Profile.module.scss';
import Icon from '../util/Icon';
import StatusMenu from './StatusMenu';
import ConnectedVoice from './ConnectedVoice';

import { RiotClient, pubsub } from '../../index';

function properStatus(status: string): string {
	let tempStatus = status;
	if(tempStatus.toUpperCase() === "OFFLINE") tempStatus = "invisible";

	return tempStatus.charAt(0).toUpperCase()
		+ tempStatus.substr(1).toLowerCase();
}

export default class Profile extends React.Component<{}, {
	username: string,
	status: string,
	avatarURL: string,
	statusMenuOpen: boolean
}> {
	constructor(props: {}) {
		super(props);
		this.state = {
			username: "",
			status: "",
			avatarURL: "",
			statusMenuOpen: false
		}

		this.updateStateFromClient = this.updateStateFromClient.bind(this);
		this.setStatusMenu = this.setStatusMenu.bind(this);
	}

	componentDidMount() {
		this.setState((prevState, props) => {
			return Object.assign({}, prevState, {
				username: RiotClient.user.username,
				status: properStatus(RiotClient.user.status || "invisible"),
				avatarURL: RiotClient.user.avatarURL
			});
		});
	}

	updateStateFromClient() {

	}

	setStatusMenu(open: boolean) {
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				statusMenuOpen: open
			});
		});
	}

	render() {
		return (
			<div style={{ flex: "0 0 auto" }}>
				<ConnectedVoice />
				<StatusMenu open={this.state.statusMenuOpen} onSet={() => this.setStatusMenu(false)}/>
				<div className={`${styles.profile}`}>
					<div className={`${styles.picture}`} style={{ backgroundImage: `url("${this.state.avatarURL}")` }} onClick={() => this.setStatusMenu(!this.state.statusMenuOpen)}/>
					<div className={`${styles.username}`}>
						<span>{this.state.username}</span>
						{this.state.status.toUpperCase() !== "ONLINE" && <div className={`${styles.status}`}>{this.state.status}</div> }
					</div>
					<Icon className={styles.settings} icon="cog" onClick={ () => { pubsub.emit('openSettings'); } } />
				</div>
			</div>
		)
	}
}