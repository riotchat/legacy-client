import * as React from 'react';
import moment from 'moment';

import css from "./MessageGroup.module.scss";
import { User } from 'riotchat.js';

export default class MessageGroup extends React.Component<{
    user: User,
    timestamp?: number
}> {
    render() {
        if(this.props.user === undefined) return null;
        return (
            <div className={css.messageGroup}>
                <div className={css.pfp} style={{ backgroundImage: `url("${this.props.user.avatarURL}")` }}></div>
                <div className={css.content}>
                    <span className={css.header}>
                        <span className={css.username}>{this.props.user.username}</span>
                        { this.props.timestamp && (
                            <time>{ moment(this.props.timestamp * 1000).calendar() }</time>
                        )}
                    </span>
                    {this.props.children}
                </div>
            </div>
        )
    }
}