/**
 * Status Menu
 * @namespace statusmenu
 */

import * as React from 'react';
import css from './StatusMenu.module.scss';
import Icon from '../util/Icon';
import { RiotClient } from '../..';
import { Activity } from 'riotchat.js/dist/api/v1/users';

export class Status extends React.Component<{ name: string, description?: string, className?: string, onClick?: () => void }> {
    render() {
        return (
            <div className={css.status} onClick={() => { if (this.props.onClick) this.props.onClick(); }}>
				<div className={css.dotAndName}>
					<span className={`${css.dot} ${this.props.className ? this.props.className : ""}`}/>
					{ this.props.description === undefined ? (
						<span className={css.name}>{this.props.name}</span>
					) : (
						<div className={css.nameWrapper}>
							<span className={css.name}>{this.props.name}</span>
							<span className={css.description}>{this.props.description}</span>
						</div>
					)}
				</div>
			</div>
        )
    }
}

export default class StatusMenu extends React.Component<{
	onSet?: (status: "online" | "away" | "busy" | "offline") => void
}> {
	render() {
		return (
			<div className={css.menu}>
				<div className={css.picker}>
					<div className={css.status} onClick={(e) => {
						e.stopPropagation();
						let status = prompt("Enter the custom status you want to set");
						if(status == null || status == "" || status.trim() == "") return;
						else RiotClient.user.setActivity(Activity.Custom, status.trim());
					}}>
						<div className={css.iconAndName}>
							<Icon className={css.icon} icon="user-voice"/>
							<span className={css.name}>{ RiotClient.user.activity.type !== Activity.Custom ? "Set custom status" : "Edit status" }</span>
							{ RiotClient.user.activity.type === Activity.Custom && <Icon className={css.clear} icon="x" type="regular" onClick={(e) => {
								e.stopPropagation();
								RiotClient.user.setActivity(Activity.None);
							}}/> }
						</div>
					</div>
					<div className={css.divider}/>
					<Status name="Online" className={css.online} onClick={() => { if (this.props.onSet) this.props.onSet("online"); }} />
					<Status name="Away" className={css.away} onClick={() => { if (this.props.onSet) this.props.onSet("away"); }} />
					<Status name="Busy" className={css.busy} onClick={() => { if (this.props.onSet) this.props.onSet("busy"); }} />
					<Status name="Invisible" description="You will appear offline to others, but will have full access to Riot."
						onClick={() => { if (this.props.onSet) this.props.onSet("offline"); }} />
				</div>
			</div>
		)
	}
}