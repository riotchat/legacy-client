/**
 * Profile widget for displaying user status
 * @namespace app
 */

import * as React from 'react';
import styles from './Profile.module.scss';
import Icon from '../util/Icon';

export default class Profile extends React.Component<{
    username: string,
    status: string,
    avatarURL: string
}> {
    render() {
        return (
            <div className={`${styles.profile}`}>
                <div className={`${styles.picture}`} style={{ backgroundImage: `url("${this.props.avatarURL}")` }}/>
                <div className={`${styles.username}`}>
					<div>{this.props.username}</div>
                    <div className={`${styles.status}`}>{this.props.status}</div>
                </div>
                <Icon className={styles.settings} icon="cog" />
            </div>
        )
    }
}