import { ThemeInfo, StreamerMode, AccessibilityOptions } from "./components/util/ExtendableComponent";
import lodash from 'lodash';
import { pubsub } from ".";

// https://gist.github.com/navix/6c25c15e0a2d3cd0e5bce999e0086fc9
type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends Array<infer U>
		? Array<DeepPartial<U>>
		: T[P] extends ReadonlyArray<infer U>
			? ReadonlyArray<DeepPartial<U>>
			: DeepPartial<T[P]>
};

// https://stackoverflow.com/a/13532993
export function shadeColor(color: string, percent: number) {
	var R = parseInt(color.substring(1,3),16);
	var G = parseInt(color.substring(3,5),16);
	var B = parseInt(color.substring(5,7),16);
	
	R = Math.floor(R * (100 + percent) / 100);
	G =	Math.floor(G * (100 + percent) / 100);
	B = Math.floor(B * (100 + percent) / 100);
	
	R = (R<255) ? ((R > 0) ? R : 0) : 255;
	G = (G<255) ? ((G > 0) ? G : 0) : 255;
	B = (B<255) ? ((B > 0) ? B : 0) : 255;
	
	var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
	var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
	var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

	return "#"+RR+GG+BB;
}

// https://stackoverflow.com/a/5624139
export function hexToRgb(hex: string): { r: number, g: number, b: number } {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : { r: 0, g: 0, b: 0 };
}

// https://awik.io/determine-color-bright-dark-using-javascript/
export function isLight(r: number, g: number, b: number): boolean {
	let hsp;

	// HSP equation from http://alienryderflex.com/hsp.html
	hsp = Math.sqrt(
		0.299 * (r * r) +
		0.587 * (g * g) +
		0.114 * (b * b)
	);

	// Using the HSP value, determine whether the color is light or dark
	//console.log(r, g, b, hsp);
	return hsp > 175;
}

export type ClientOptions = {
	themeInfo: ThemeInfo;
	streamerMode: StreamerMode,
	accessibility: AccessibilityOptions
}

export function getOptions(): ClientOptions {
	let optionsJSON = localStorage.getItem("options");
	let defaultOptions: ClientOptions = {
		themeInfo: {
			theme: "dark",
			accent: "7B68EE"
		},
		streamerMode: {
			enabled: false
		},
		accessibility: {
			colorblind: false,
			outlines: false,
			pinchToZoom: false,
			highlight: false,
			highContrast: false,
			bold: false,
			noAnimations: false,
			noBackButton: false,

			textToSpeech: false,
		}
	}

	if(optionsJSON === null) {
		localStorage.setItem("options", JSON.stringify(defaultOptions));
		return defaultOptions;
	}

	try {
		let options = JSON.parse(optionsJSON);
		lodash.defaultsDeep(options, defaultOptions);
		return options;
	} catch(e) {
		console.error("Local Storage client options were corrupted!");
		localStorage.setItem("options", JSON.stringify(defaultOptions));
		return defaultOptions;
	}
}

export function setOptions(options: DeepPartial<ClientOptions>) {
	pubsub.emit('optionsUpdate', lodash.defaultsDeep(options, getOptions()));
}