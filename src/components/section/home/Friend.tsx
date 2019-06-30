import * as React from 'react';

import css from './Friend.module.scss';
import Icon from '../../util/Icon';

import { User } from 'riotchat.js';
import { RiotClient } from '../../..';

function properStatus(status: string): string {
    let tempStatus = status;
    if(tempStatus.toUpperCase() === "INVISIBLE") tempStatus = "offline";

    return tempStatus.charAt(0).toUpperCase()
        + tempStatus.substr(1).toLowerCase();
}

export default class Friend extends React.Component<{
	user: User,
	type?: "mutual" | "incoming" | "outgoing",
	hidden?: boolean,
	onClick?: () => void
}> {
	constructor(props: any) {
		super(props);
		this.onAccept = this.onAccept.bind(this);
		this.onDecline = this.onDecline.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.removeFriend = this.removeFriend.bind(this);
	}

	async onAccept() {
		if(this.props.type !== "incoming") return;
		let user = await RiotClient.fetchUser(this.props.user.id);
		user.addFriend();
	}

	async onDecline() {
		if(this.props.type !== "incoming") return;
		let user = await RiotClient.fetchUser(this.props.user.id);
		user.removeFriend();
	}

	async onCancel() {
		if(this.props.type !== "outgoing") return;
		let user = await RiotClient.fetchUser(this.props.user.id);
		user.removeFriend();
	}

	async removeFriend() {
		if(this.props.type !== "mutual") return;
		let username = this.props.user.username;
		let confirmation = confirm(`Are you sure you want to remove ${username} from your friends list?`);
		if(!confirmation) return;
		try {
			let user = await RiotClient.fetchUser(this.props.user.id);
			await user.removeFriend();
			alert(`Removed ${username} from your friends list`);
		} catch(e) {
			alert(`Couldn't remove ${username} from your friends list!`);
		}
	}

	render() {
		return (
			<div className={`${css.friend} ${this.props.hidden ? css.hidden : ""} ${this.props.type === "mutual" && this.props.onClick ? css.clickable : ""}`}
				onClick={(e => { if(this.props.onClick) this.props.onClick(); })}
			>
				<div className={css.name}>
					<div className={css.avatar} style={{backgroundImage: `url(${this.props.user.avatarURL})`}}/>
					<span className={css.username}>{this.props.user.username}</span>
					{ (this.props.type === undefined || this.props.type === "mutual") && (
						<div className={css.status}>
							<span className={`${css.indicator} ${this.props.user.status !== undefined && css[this.props.user.status]}`} />
							<span className={css.statusText}>{this.props.user.status !== undefined ? properStatus(this.props.user.status) : properStatus("offline")}</span>
						</div>
					)}
				</div>
				{ (this.props.type === undefined || this.props.type === "mutual") && (
					<div className={`${css.buttons} ${css.desktopOnly}`}>
						<div className={css.call}>
							<Icon icon="phone-call" />
						</div>
						<div className={css.videochat}>
							<Icon icon="video" />
						</div>
						<div className={css.remove} onClick={this.removeFriend}>
							<Icon icon="user-minus" />
						</div>
					</div>
				)}
				{ this.props.type === undefined || this.props.type === "mutual" ? (
					<div className={css.mobileStatus}>
						<span className={`${css.indicator} ${this.props.user.status !== undefined && css[this.props.user.status]}`} />
					</div>
				) : (
					<div className={css.buttons}>
						{ this.props.type === "incoming" ? ([
							<div className={css.accept} onClick={this.onAccept}>
								<Icon icon="user-plus" />
							</div>,
							<div className={css.decline} onClick={this.onDecline}>
								<Icon icon="user-x" />
							</div>
						]) : (
							<div className={css.cancel} onClick={this.onCancel}>
								<Icon icon="x" type="regular"/>
							</div>
						)}
					</div>
				)}
			</div>
		)
	}
}