import * as React from 'react';

import css from './StreamerMode.module.scss';
import style from './Main.module.scss';
import Icon from '../../util/Icon';
import { OptionsComponent } from '../../util/ExtendableComponent';
import { pubsub } from '../../..';
import { Checkbox } from '../../../components/util/FormComponents';
import { setOptions } from '../../../utilFuctions';

export default class StreamerModePanel extends OptionsComponent {
	constructor(props: any) {
		super(props);
		this.switchStreamerMode = this.switchStreamerMode.bind(this);
	}

	switchStreamerMode(checked: boolean) {
		setOptions({
			streamerMode: { enabled: checked }
		});
	}
	
	render() {
		return (
			<div className={css.panel}>
				<div className={style.section}>
					<Checkbox
						type="toggle" text="Enable Streamer Mode"
						description="Streamer Mode hides your personal information from being shown during a live broadcast."
						checked={this.state.options.streamerMode.enabled} onChecked={this.switchStreamerMode} />
					<Checkbox
						type="toggle" text="Automatically enable/disable"
						description="Automatically enables/disables Streamer Mode if a streaming app is detected."
						/>
					<Checkbox
						type="toggle" text="Enable/disable on livestream start"
						description="Automatically enables/disables when your stream goes live. For this to work, link one of your accounts to Riot."
						/>
				</div>
				<div className={style.section}>
					<div className={style.category}>Options</div>
					<Checkbox
						type="toggle" text="Hide sensitive information"
						description="Hides your e-mail address, UID, linked accounts and mutual servers."
						/>
					<Checkbox
						type="toggle" text="Anonymize invite links"
						description="All invite links will be anonymized."
						/>
					<Checkbox
						type="toggle" text="Hide Friend Requests"
						description="You won't be able to view your pending friend requests when Streamer Mode is enabled."
						/>

				</div>
				<div className={style.section}>
					<div className={style.category}>Connected Accounts</div>
					<span>Twitch.tv</span>
					<span>Mixer</span>
					<span>Steam.tv</span>
				</div>
			</div>
		)
	}
}