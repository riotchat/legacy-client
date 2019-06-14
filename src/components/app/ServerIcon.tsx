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
                <div className={`${styles.icon}`}>
                    <img src={this.props.iconURL} draggable={false} />
                </div>
                {/*<div className={`${styles.username}`}>
					<div>{this.props.serverName}</div>
                </div>*/}
            </div>
        )
    }
}