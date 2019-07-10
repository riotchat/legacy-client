import * as React from 'react';

import css from './Accessibility.module.scss';
import style from './Main.module.scss';
import Icon from '../../util/Icon';
import { Checkbox } from '../../../components/util/FormComponents';
import { OptionsComponent } from '../../../components/util/ExtendableComponent';
import { setOptions } from '../../../utilFuctions';

export default class AccessibilityPanel extends OptionsComponent {
	render() {
		return (
			<div className={css.panel}>
				<div className={style.section}>
					<div className={style.category}>Visual Options</div>
                    <Checkbox
						checked={this.state.options.accessibility.colorblind}
						onChecked={(checked) => setOptions({ accessibility: { colorblind: checked } }) }
						type="toggle" text="Colorblind Mode"
						description="Changes some things to better suit colorblindness."
						/>
					<Checkbox
						checked={this.state.options.accessibility.outlines}
						onChecked={(checked) => setOptions({ accessibility: { outlines: checked } }) }
						type="toggle" text="Enable Outlines"
						description="Enables outlines on buttons, tabs and text inputs."
						/>
					<Checkbox
						checked={this.state.options.accessibility.pinchToZoom}
						onChecked={(checked) => setOptions({ accessibility: { pinchToZoom: checked } }) }
						type="toggle" text="Enable Pinch-to-Zoom"
						description="Allows you to pinch-to-zoom into content on mobile devices."
						/>
                    <Checkbox
						checked={this.state.options.accessibility.highlight}
						onChecked={(checked) => setOptions({ accessibility: { highlight: checked } }) }
						type="toggle" text="Enable Highlight"
						description="Enables highlight color when tapping on mobile devices."
						/>
                    <Checkbox
						checked={this.state.options.accessibility.highContrast}
						onChecked={(checked) => setOptions({ accessibility: { highContrast: checked } }) }
						type="toggle" text="Enable High-Contrast Mode"
						description="Enables high-contrast mode. You won't be able to pick an accent color when this mode is enabled."
						/>
                    <Checkbox
						checked={this.state.options.accessibility.bold}
						onChecked={(checked) => setOptions({ accessibility: { bold: checked } }) }
						type="toggle" text="Enable Bold Text"
						description="This option will change all text to appear bolder."
						/>
					<Checkbox
						checked={this.state.options.accessibility.noAnimations}
						onChecked={(checked) => setOptions({ accessibility: { noAnimations: checked } }) }
						type="toggle" text="Disable Animations"
						description="Disables any components with animations."
						/>
                    <Checkbox
						checked={this.state.options.accessibility.noBackButton}
						onChecked={(checked) => setOptions({ accessibility: { noBackButton: checked } }) }
						type="toggle" text="Disable Back Button Drawer"
						description="Disables drawer opening on back button press on Android."
						/>
				</div>
                <div className={style.section}>
					<div className={style.category}>Auditory Options</div>
                    <Checkbox
						checked={this.state.options.accessibility.textToSpeech}
						onChecked={(checked) => setOptions({ accessibility: { textToSpeech: checked } }) }
						type="toggle" text="Enable Text-to-Speech"
						description="Allows playback of text when selected."
						/>
				</div>
				<div className={style.section}>
					<div className={style.category}>Chat Font Scaling</div>
						<input type="range" name="points" min="80" max="160" step="20"/>
				</div>
                <div className={style.section}>
					<div className={style.category}>Zoom Options</div>
					<input type="range" name="points" min="50" max="200" step="15"/>
				</div>
                <div className={style.section}>
					<div className={style.footer}>Did we miss anything? Let us know over at <a className={style.link} href="https://riotchat.gq/accessibility" target="_blank">riotchat.gq/accessibility</a></div>
				</div>
			</div>
		)
	}
}