/**
 * Direct message button
 * @namespace home
 */

import * as React from 'react';
import styles from './DirectMessage.module.scss';

export default class DirectMessage extends React.Component<{
    username: string,
    status?: string,
    avatarURL: string
}> {
    render() {
        return (
            <div className={styles.parent}>
                <div className={styles.avatar}>
                    <img src={this.props.avatarURL} draggable={false} />
                </div>
                <div className={styles.username}>
					<div>{this.props.username}</div>
                    { this.props.status && <div className={styles.status}>{this.props.status}</div> }
                </div>
            </div>
        )
    }
}