/**
 * Direct message button
 * @namespace home
 */

import * as React from 'react';
import styles from './DirectMessage.module.scss';
import Icon from '../../util/Icon';
import { User } from 'riotchat.js';
import { properStatus } from '../../app/Profile';
import { Group } from 'riotchat.js/dist/internal/Group';

export default class DirectMessage extends React.Component<{
	userOrGroup: User | Group,
	mobile?: boolean,
	active?: boolean
	onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}> {
	render() {
		if(this.props.userOrGroup instanceof User) return (
			<div className={`${styles.parent} ${this.props.active ? styles.active : ""}`} draggable={true} onClick={(e) => { if(this.props.onClick) this.props.onClick(e); }}>
				<div className={styles.avatar}
					aria-label={this.props.userOrGroup.username} 
					style={{ backgroundImage: `url("${this.props.userOrGroup.avatarURL}")` }}
				>
					<div className={`${styles.indicator} ${this.props.userOrGroup.status ? styles[this.props.userOrGroup.status.toLowerCase()] : ""}`}
						aria-label={this.props.userOrGroup.status}
					/>
				</div>
				<div className={styles.username}>
					<div className={styles.usernameInline}>
						<span>{this.props.userOrGroup.username}</span>
						<span className={styles.mobile}><Icon icon="mobile" type="regular"/></span>
						{ this.props.mobile && <div className={styles.mobile}><Icon icon="mobile" type="regular"/></div> }
					</div>
					{ this.props.userOrGroup.status && this.props.userOrGroup.status.toUpperCase() !== "ONLINE" &&
						<div className={styles.status}>{properStatus(this.props.userOrGroup.status)}</div> }
				</div>
			</div>
		);
		else if(this.props.userOrGroup instanceof Group) return (
			<div className={`${styles.parent} ${this.props.active ? styles.active : ""}`} draggable={true} onClick={(e) => { if(this.props.onClick) this.props.onClick(e); }}>
				<div className={styles.avatar}
					aria-label={this.props.userOrGroup.title} 
					style={{ backgroundColor: "transparent", backgroundImage: `url("/assets/images/groupdm.svg")` }}
				/>
				<div className={styles.username}>
					<div className={styles.usernameInline}>{this.props.userOrGroup.displayTitle}</div>
					<div className={styles.status}>{`${this.props.userOrGroup.members.size} ${this.props.userOrGroup.members.size === 1 ? "member" : "members"}`}</div>
				</div>
			</div>
		);
		else return null;
	}
}