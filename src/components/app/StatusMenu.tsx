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
	open?: boolean,
	onSet?: (status: "online" | "away" | "busy" | "offline") => void
}> {
	render() {
		return (
			<div className={`${css.menu} ${this.props.open === false ? css.hidden : ""}`}>
				<div className={css.picker}>
					<div className={css.status} onClick={() => {
						let status = prompt("Enter the custom status you want to set");
						if(status == null || status == "" || status.trim() == "") RiotClient.user.setActivity(Activity.None);
						else RiotClient.user.setActivity(Activity.Custom, status.trim());
					}}>
						<div className={css.iconAndName}>
							<Icon className={css.icon} icon="user-voice"/>
							<span className={css.name}>Set custom status</span>
							<Icon className={css.clear} icon="x"/>
						</div>
					</div>
					<div className={css.divider} />
					<div className={css.status} onClick={() => { if (this.props.onSet) this.props.onSet("online"); }}>
						<div className={css.dotAndName}>
							<span className={`${css.dot} ${css.online}`}/>
							<span className={css.name}>Online</span>
						</div>
					</div>
					<div className={css.status} onClick={() => { if (this.props.onSet) this.props.onSet("away"); }}>
						<div className={css.dotAndName}>
							<span className={`${css.dot} ${css.away}`}/>
							<span className={css.name}>Away</span>
						</div>
					</div>
					<div className={css.status} onClick={() => { if (this.props.onSet) this.props.onSet("busy"); }}>
						<div className={css.dotAndName}>
							<span className={`${css.dot} ${css.busy}`}/>
							<span className={css.name}>Busy</span>
						</div>
					</div>
					<div className={css.status} onClick={() => { if (this.props.onSet) this.props.onSet("offline"); }}>
						<div className={css.dotAndName}>
							<span className={css.dot}/>
							<div className={css.nameWrapper}>
								<span className={css.name}>Invisible</span>
								<span className={css.description}>You will appear offline to others, but will have full access to Riot.</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}