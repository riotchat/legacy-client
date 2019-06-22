/**
 * Profile widget for displaying user status
 * @namespace app
 */

import * as React from 'react';
import styles from './Profile.module.scss';
import Icon from '../util/Icon';

export default class Profile extends React.Component<{
	username: string,
    avatarURL: string
}> {
    render() {
        return (
            <div className={`${styles.profile}`}>
                <div className={`${styles.picture}`}>
                    <img src={this.props.avatarURL} draggable={false} />
                </div>
                <div className={`${styles.username}`}>
					<div>{this.props.username}</div>
                </div>
                <Icon className={styles.button} icon="settings" />
            </div>
        )
    }
}