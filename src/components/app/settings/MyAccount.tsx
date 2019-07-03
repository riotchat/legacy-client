import * as React from 'react';

import css from './MyAccount.module.scss';
import Icon from '../../util/Icon';
import { RiotClient } from '../../..';
import Tooltip from '@material-ui/core/Tooltip';
import { StreamerModeComponent } from '../../util/StreamerModeComponent';

const idTooltip = `
This ID is unique to you and only you.
It allows you to have any username you
can think of, even if it might not be that
original. Also, you won't have to deal with
those random number tags (thank god)
`

export default class MyAccountPanel extends StreamerModeComponent {
	render() {
		//let account: React.ReactNode;
		return (
			<div className={css.root}>
				<div className={css.account}>
					<div className={css.pfp} style={{ backgroundImage: `url("${RiotClient.user.avatarURL}")` }}>
						<div className={css.edit}>
							<Icon className={css.icon} icon="pencil"/>
						</div>
					</div>
					<div className={css.details}>
						<span className={css.name}>{RiotClient.user.username}</span>
						{!this.state.streamerMode.enabled && ( <span className={css.id}>
							<span className={css.title}>UID:</span>
							<span className={css.copy}>{RiotClient.user.id}</span>
							<Tooltip title={idTooltip}>
								<span><Icon icon="help-circle" /></span>
							</Tooltip>
						</span> )}
						{!this.state.streamerMode.enabled && ( <div className={css.securityEnabled}>
							<Icon className={css.lock} icon="lock-alt" />
							<span>2FA has been enabled on this account. Learn more</span>
						</div> )}
					</div>
				</div>
				<span className={css.category}>2FA Authentication</span>
				<button className={css.button}>View Backup Codes</button>
				<button className={css.button}>Remove 2FA</button>

				<span className={css.category}>Pending Community Strikes</span>
				<div className={css.timeline}>
					<div className={css.strike}>
						<span className={css.date}>02/07/2019</span>
						<span className={css.title}>Strike<span className={css.count}>1</span></span>
						<div className={css.details}>You have been issued a warning by a community moderator for playing Fortnite on a public server.</div>
						<div className={css.expires}>Expires 01/08/2019</div>
					</div>
				</div>
			</div>
		)
	}
}