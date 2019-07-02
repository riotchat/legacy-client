/**
 * Home-specific sidebar
 * @namespace home
 */

import * as React from 'react';

import DirectMessage from './DirectMessage';

import styles from './Sidebar.module.scss';
import Icon from '../../util/Icon';
import { scrollable } from '../../util/Scrollbar';
import { RiotClient } from '../../..';
import { ChannelType } from 'riotchat.js/dist/api/v1/channels';
import { User } from 'riotchat.js';

export type BaseChannels = "friends" | "news" | "feed";

export default class HomeSidebar extends React.Component<{ channel: string, onChangeChannel: (channel: BaseChannels | string) => void }> {
    render() {
        let dms: Array<React.ReactNode> = [];
        RiotClient.channels.forEach((channel, key, map) => {
            if(channel.users === undefined || channel.users.indexOf(RiotClient.user) === -1) return;
            if(channel.type === ChannelType.DM) {
                let users = channel.users.filter((value, index, array) => {
                    return value.id !== RiotClient.user.id;
                });
                let user = users[0] !== undefined ? users[0] : RiotClient.user;
                dms.push(
                    <DirectMessage key={`dm${user.id}`}
                        user={user}
                        mobile={false}
                        onClick={(e) => this.props.onChangeChannel(channel.id)} active={this.props.channel === channel.id} />
                )
            } else if(channel.type === ChannelType.GROUP) {
                // GDM code here
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
                        <Icon className={styles.button} icon="user-plus" />
                    </div>
                    <div className={styles.directMessages}>
                        {dms}
                    </div>
                </div>
                <div className={styles.groupdm}>
                    <div className={styles.category}>
                        <span className={styles.title}>Group Messages</span>
                        <Icon className={styles.button} icon="plus" type="regular" />
                    </div>
                    <div className={styles.directMessages}>
                        {/*{groupdms}*/}
                    </div>
                </div>
            </div>
        )
    }
}