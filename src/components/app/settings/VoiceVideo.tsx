import * as React from 'react';

import css from './VoiceVideo.module.scss';
import style from './Main.module.scss';
import Icon from '../../util/Icon';
import { RadioGroup, Checkbox } from '../../../components/util/FormComponents';

export default class VoiceVideoPanel extends React.Component {
	render() {
		return (
			<div className={css.panel}>
                <div className={style.section}>
					<div className={style.category}>Input Mode</div>
                    <RadioGroup>
						<Checkbox checked={true} type="radio" text="Voice Activity"/>
						<Checkbox type="radio" text="Push-to-Talk"/>
					</RadioGroup>
				</div>
				<div className={style.section}>
					<div className={style.category}>Voice Processing</div>
                    <Checkbox
						type="toggle" text="Echo Cancellation"
						description=""
						/>
					<Checkbox
						type="toggle" text="Noise Suppression"
						description=""
						/>
					<Checkbox
						type="toggle" text="Automatic Gain Control"
						description=""
						/>
				</div>
                <div className={style.section}>
					<div className={style.category}>QoS (Quality of Service)</div>
                    <Checkbox
						type="toggle" text="Enable High Packet Priority"
						description="Sends a request to enable Riot to transmit high priority packets. Before enabling this, check if you have QoS enabled on your router."
						/>
				</div>
				<div className={style.section}>
					<div className={style.category}>Chat Font Scaling</div>
				</div>
                <div className={style.section}>
					<div className={style.category}>Zoom Options</div>
				</div>
			</div>
		)
	}
}