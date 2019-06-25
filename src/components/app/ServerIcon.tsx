/**
 * Server Icon
 * @namespace servericon
 */

import * as React from 'react';
import styles from './ServerIcon.module.scss';

export default class ServerIcon extends React.Component<{
	serverName: string,
    iconURL: string
}> {
    render() {
        return (
            <div>
                <div className={`${styles.icon}`} draggable={true} style={{ backgroundImage: `url("${this.props.iconURL}")` }}/>
            </div>
        )
    }
}