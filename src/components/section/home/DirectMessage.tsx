/**
 * Direct message button
 * @namespace home
 */

import * as React from 'react';
import styles from './DirectMessage.module.scss';
import Icon from '../../util/Icon';
import { User } from 'riotchat.js';

export default class DirectMessage extends React.Component<{
	user: User,
	mobile?: boolean,
	active?: boolean
	onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}> {
	render() {
		if(this.props.user === undefined) return;
		return (
			<div className={`${styles.parent} ${this.props.active ? styles.active : ""}`} draggable={true} onClick={(e) => { if(this.props.onClick) this.props.onClick(e); }}>
				<div className={styles.avatar} aria-label="" title={this.props.user.username} style={{ backgroundImage: `url("${this.props.user.avatarURL}")` }}/>
				<div className={styles.username}>
					<div className={styles.usernameInline}>
						<span>{this.props.user.username}</span>
						{ this.props.mobile && <div className={styles.mobile}><Icon icon="mobile" type="regular"/></div> }
					</div>
					{ this.props.user.status && <div className={styles.status}>{this.props.user.status}</div> }
				</div>
			</div>
		)
	}
}