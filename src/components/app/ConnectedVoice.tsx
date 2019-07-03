/**
 * Connected to voice channel
 * @namespace connectedvoice
 */

import * as React from 'react';
import css from './ConnectedVoice.module.scss';
import Icon from '../util/Icon';

export default class ConnectedVoice extends React.Component<{
	open?: boolean,
	onSet?: (status: "online" | "away" | "busy" | "invisible") => void
}> {
	render() {
		return (
			<div className={css.menu}>
				<div className={css.connected}>
					<span className={css.status}>Connected - click to change</span>
					<Icon className={css.disconnect} icon="x" type="regular" />
					<div className={css.channel}>
						<Icon className={css.icon} icon="chat" />
						<span>chatter</span>
					</div>
					<div className={css.connectedUsers}>
						<Icon className={css.mute} icon="microphone"/>
						<div className={css.user}/>
					</div>

					<div className={css.audioControls}>
						<Icon className={css.deafen} icon="volume-full"/>
						<div className={css.volumeBar}>

						</div>
					</div>
				</div>
			</div>
		)
	}
}