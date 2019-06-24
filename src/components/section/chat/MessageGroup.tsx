import * as React from 'react';
import moment from 'moment';

import css from "./MessageGroup.module.scss";

export default class MessageGroup extends React.Component<{
    username: string,
    pfpURL: string,
    timestamp?: number
}> {
    render() {
        return (
            <div className={css.messageGroup}>
                <div className={css.pfp} style={{ backgroundImage: `url("${this.props.pfpURL}")` }}></div>
                <div className={css.content}>
                    <span className={css.header}>
                        <span className={css.username}>{this.props.username}</span>
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