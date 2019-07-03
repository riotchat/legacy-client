import * as React from 'react';

import css from './MyAccount.module.scss';
import style from './Main.module.scss';
import Icon from '../../util/Icon';
import { RiotClient } from '../../..';
import Tooltip from '@material-ui/core/Tooltip';
import { StreamerModeComponent } from '../../util/ExtendableComponent';

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
			<div className={css.panel}>
				<div className={style.section}>
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
							<a className={css.button}>Edit</a>
						</div>
					</div>
				</div>
				{!this.state.streamerMode.enabled && ( <div className={style.section}>
					<div className={style.category}>UID</div>
					<span className={css.copy}>{RiotClient.user.id}</span>
					<Tooltip title={idTooltip}>
						<span><Icon icon="help-circle" /></span>
					</Tooltip>
				</div> )}
				<div className={style.section}>
					<div className={style.category}>2FA Authentication</div>
					<div className={css.securityEnabled}>
						<Icon className={css.lock} icon="lock-alt" />
						<span>2FA has been enabled on this account. Learn more</span>
					</div>
					<a className={css.button}>View Backup Codes</a>
					<a className={`${css.button} ${css.red}`}>Remove 2FA</a>
				</div>
				<div className={style.section}>
					<div className={style.category}>Pending Community Strikes</div>
					<div className={css.timeline}>
						<div className={css.strike}>
							<span className={css.date}>02/07/2019</span>
							<span className={css.title}>Strike<span className={css.count}>1</span></span>
							<div className={css.details}>You have been issued a warning by a community moderator for playing Fortnite on a public server.</div>
							<div className={css.expires}>Expires 01/08/2019</div>
						</div>
					</div>
				</div>
			</div>
			
		)
	}
}