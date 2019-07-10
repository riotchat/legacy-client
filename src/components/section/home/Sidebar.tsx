/**
 * Home-specific sidebar
 * @namespace home
 */

import * as React from 'react';

import DirectMessage from './DirectMessage';

import styles from './Sidebar.module.scss';
import Icon from '../../util/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import { scrollable } from '../../util/Scrollbar';
import { RiotClient } from '../../..';
import { ChannelType } from 'riotchat.js/dist/api/v1/channels';
import { User } from 'riotchat.js';
import { Group } from 'riotchat.js/dist/internal/Group';
import { DMChannel, GroupChannel } from 'riotchat.js/dist/internal/Channel';

export type BaseChannels = "friends" | "news" | "feed";

// TODO: Optimize the sidebar as force updates are bad
export default class HomeSidebar extends React.Component<{ channel: string, onChangeChannel: (channel: BaseChannels | string) => void }> {
	constructor(props: any) {
		super(props);
		this.userUpdate = this.userUpdate.bind(this);
	}

	componentDidMount() {
		RiotClient.on('userUpdate', this.userUpdate);
	}

	componentWillUnmount() {
		RiotClient.removeListener('userUpdate', this.userUpdate);
	}

	userUpdate(user: User) {
		let hasDMChannel = false;
		for (let channel of RiotClient.channels.values()) {
			if(!(channel instanceof DMChannel) || channel.users.indexOf(RiotClient.user) === -1) return;
			if(channel.users.indexOf(user) !== -1) {
				hasDMChannel = true;
				break;
			}
		}

		if(hasDMChannel) this.forceUpdate();
	}

	render() {
		let dms: Array<React.ReactNode> = [];
		let groupdms: Array<React.ReactNode> = [];

		RiotClient.channels.forEach((channel, key, map) => {
			console.log(channel);
			if(channel instanceof DMChannel) {
				let users = channel.users.filter((value, index, array) => {
					return value.id !== RiotClient.user.id;
				});
				let user = users[0] !== undefined ? users[0] : RiotClient.user;
				dms.push(
					<DirectMessage key={`dm${user.id}`}
						userOrGroup={user}
						mobile={false}
						onClick={(e) => this.props.onChangeChannel(channel.id)} active={this.props.channel === channel.id} />
				)
			} else if(channel instanceof GroupChannel) {
				groupdms.push(
					<DirectMessage key={`gdm${channel.id}`}
						userOrGroup={channel.group}
						mobile={false}
						onClick={(e) => this.props.onChangeChannel(channel.id)} active={this.props.channel === channel.id} />
				)
			}
		});

		return (
			<div className={scrollable} style={{ flexGrow: 1 }}>
				<div className={styles.feed}>
					<div className={`${styles.feedTab} ${this.props.channel === "feed" ? styles.active : ""}`} onClick={(e) => this.props.onChangeChannel("feed") }>
						<Icon className={styles.icon} icon="home" />
						<span className={styles.name}>Feed</span>
					</div>
					<div className={`${styles.feedTab} ${this.props.channel === "news" ? styles.active : ""}`} onClick={(e) => this.props.onChangeChannel("news") }>
						<Icon className={styles.icon} icon="news" />
						<span className={styles.name}>News</span>
					</div>
					<div className={`${styles.feedTab} ${this.props.channel === "friends" ? styles.active : ""}`} onClick={(e) => this.props.onChangeChannel("friends") }>
						<Icon className={styles.icon} icon="user-detail" />
						<span className={styles.name}>Friends</span>
					</div>
				</div>
				<div className={styles.categoryNearby}>
					<Icon className={styles.nearby} icon="analyse" />
					<span className={styles.title}>Nearby</span>
				</div>
				<div className={styles.dm}>
					<div className={styles.category}>
						<span className={styles.title}>Direct Messages</span>
						<Tooltip title="test">
							<Icon className={styles.button} icon="user-plus" />
						</Tooltip>
					</div>
					<div className={styles.directMessages}>
						{dms}
					</div>
					{ dms.length === 0 && <div className={styles.empty}/> }
				</div>
				<div className={styles.groupdm}>
					<div className={styles.category}>
						<span className={styles.title}>Group Messages</span>
						<Tooltip title="Create Group">
							<Icon className={styles.button} icon="plus" type="regular" />
						</Tooltip>
					</div>
					<div className={styles.directMessages}>
						{groupdms}
					</div>
					{ groupdms.length === 0 && <div className={styles.empty}/> }
				</div>
			</div>
		)
	}
}