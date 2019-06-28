/**
 * Direct message button
 * @namespace home
 */

import * as React from 'react';
import styles from './DirectMessage.module.scss';
import Icon from '../../util/Icon';

export default class DirectMessage extends React.Component<{
    username: string,
    status?: string,
    avatarURL: string
}> {
    render() {
        return (
            <div className={styles.parent} draggable={true}>
                <div className={styles.avatar} aria-label="" title={this.props.username} style={{ backgroundImage: `url("${this.props.avatarURL}")` }}/>
                <div className={styles.username}>
					<div>{this.props.username}</div>
                    <div className={styles.mobile}><Icon icon="mobile" type="regular"/></div>
                    { this.props.status && <div className={styles.status}>{this.props.status}</div> }
                </div>
            </div>
        )
    }
}