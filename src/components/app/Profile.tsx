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
import { User } from 'riotchat.js';
import { Activity, Status } from 'riotchat.js/dist/api/v1/users';
import { parseStatus } from '../../utilFuctions';

export function properStatus(status: string, whenOffline?: string): string {
	let tempStatus = status;
	if(tempStatus.toUpperCase() === "INVISIBLE" || tempStatus.toUpperCase() === "OFFLINE")
		tempStatus = whenOffline || "offline";

	return tempStatus.charAt(0).toUpperCase()
		+ tempStatus.substr(1).toLowerCase();
}

export default class Profile extends React.Component<{}, {
	username: string,
	status: Status,
	activity: { type: Activity, custom?: string },
	avatarURL: string,
	statusMenuOpen: boolean
}> {
	constructor(props: {}) {
		super(props);
		this.state = {
			username: "",
			status: "offline",
			activity: { type: Activity.None, custom: undefined },
			avatarURL: "",
			statusMenuOpen: false
		}

		this.updateStateFromClient = this.updateStateFromClient.bind(this);
		this.setStatusMenu = this.setStatusMenu.bind(this);
	}

	componentDidMount() {
		RiotClient.on('userUpdate', this.updateStateFromClient);
		this.setState((prevState, props) => {
			return Object.assign({}, prevState, {
				username: RiotClient.user.username,
				status: RiotClient.user.status || "offline",
				activity: RiotClient.user.activity,
				avatarURL: RiotClient.user.avatarURL
			});
		});
	}

	componentWillUnmount() {
		RiotClient.removeListener('userUpdate', this.updateStateFromClient);
	}

	updateStateFromClient(user: User) {
		if(user.id !== RiotClient.user.id || (this.state.status === user.status && this.state.activity === user.activity)) return;
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				status: user.status || "offline",
				activity: user.activity
			});
		})
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
				{/* <ConnectedVoice /> */}
				<StatusMenu open={this.state.statusMenuOpen} onSet={(status: "online" | "away" | "busy" | "offline") => {
					RiotClient.user.setStatus(status);
					this.setStatusMenu(false);
				}}/>
				<div className={`${styles.profile}`}>
					<div className={`${styles.picture}`} style={{ backgroundImage: `url("${this.state.avatarURL}")` }} onClick={() => this.setStatusMenu(!this.state.statusMenuOpen)}>
						<div className={`${styles.indicator} ${this.state.status ? styles[this.state.status.toLowerCase()] : ""}`}
							aria-label={this.state.status}
						/>
					</div>
					<div className={`${styles.username}`}>
						<span>{this.state.username}</span>
						{ !(this.state.status.toUpperCase() === "ONLINE" && this.state.activity.type === Activity.None) && (
							<div className={`${styles.status}`}>
								{ parseStatus(this.state.status, this.state.activity, styles.icon) }
							</div>
						)}
					</div>
					<Icon className={styles.settings} icon="cog" onClick={ () => { pubsub.emit('openSettings'); } } />
				</div>
			</div>
		)
	}
}