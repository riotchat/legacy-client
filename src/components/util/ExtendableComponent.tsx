import * as React from 'React';
import { pubsub, streamerMode } from '../..';
import { ClientOptions, getOptions } from '../../utilFuctions';

export type StreamerMode = {
	enabled: boolean
}

export type ThemeInfo = {
	theme: "dark" | "light",
	accent: string
}

export type AccessibilityOptions = {
	colorblind: boolean;
	outlines: boolean;
	pinchToZoom: boolean;
	highlight: boolean; // Highlight color on mobile devices
	highContrast: boolean;
	bold: boolean; // Bold Text
	noAnimations: boolean; // No Animations
	noBackButton: boolean; // No Back Button Drawer

	textToSpeech: boolean;
}

export class OptionsComponent<P = {}, S = {}> extends React.Component<P, S & { options: ClientOptions }> {
	constructor(props: P) {
		super(props);
		(this.state as any) = Object.assign({}, this.state, {
			options: getOptions()
		});

		this.onOptionsUpdate = this.onOptionsUpdate.bind(this);
	}

	componentDidMount() {
		pubsub.on('optionsUpdate', this.onOptionsUpdate);
	}

	componentWillUnmount() {
		pubsub.removeListener('optionsUpdate', this.onOptionsUpdate);
	}

	onOptionsUpdate(options: ClientOptions) {
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				options: options
			});
		});
	}
}