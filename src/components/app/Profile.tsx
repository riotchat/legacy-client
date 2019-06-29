/**
 * Profile widget for displaying user status
 * @namespace app
 */

import * as React from 'react';
import styles from './Profile.module.scss';
import Icon from '../util/Icon';

import { RiotClient } from '../../index';

function properStatus(status: string): string {
    let tempStatus = status;
    if(tempStatus.toUpperCase() === "OFFLINE") tempStatus = "invisible";

    return tempStatus.charAt(0).toUpperCase()
        + tempStatus.substr(1).toLowerCase();
}

export default class Profile extends React.Component<{}, {
    username: string,
    status: string,
    avatarURL: string
}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            username: "",
            status: "",
            avatarURL: ""
        }
    }

    componentDidMount() {
        this.setState((prevState, props) => {
            return Object.assign({}, prevState, {
                username: RiotClient.user.username,
                status: properStatus(RiotClient.user.status || "invisible"),
                avatarURL: RiotClient.user.avatarURL
            });
        });
    }

    updateStateFromClient() {

    }

    render() {
        return (
            <div className={`${styles.profile}`}>
                <div className={`${styles.picture}`} style={{ backgroundImage: `url("${this.state.avatarURL}")` }}/>
                <div className={`${styles.username}`}>
					<div>{this.state.username}</div>
                    {this.state.status.toUpperCase() !== "ONLINE" && <div className={`${styles.status}`}>{this.state.status}</div> }
                </div>
                <Icon className={styles.settings} icon="cog" />
            </div>
        )
    }
}