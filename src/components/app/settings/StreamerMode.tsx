import * as React from 'react';

import css from './StreamerMode.module.scss';
import Icon from '../../util/Icon';
import { StreamerModeComponent } from '../../util/StreamerModeComponent';
import { pubsub } from '../../..';

export default class StreamerModePanel extends StreamerModeComponent {
	constructor(props: any) {
		super(props);
		this.switchStreamerMode = this.switchStreamerMode.bind(this);
	}

	switchStreamerMode(e: React.ChangeEvent<HTMLInputElement>) {
		pubsub.emit('streamerMode', Object.assign({}, this.state.streamerMode, { enabled: e.target.checked }));
	}
	
	render() {
		return (
			<div className={css.panel}>
				<div className={css.category}>Streamer Mode</div>
				<input id="streamermodecheckbox" type="checkbox" checked={this.state.streamerMode.enabled} onChange={this.switchStreamerMode} />
				<label htmlFor="streamermodecheckbox">Enable Streamer Mode</label>
			</div>
		)
	}
}