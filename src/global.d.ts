declare module '*.png'
declare module '*.jpg'
declare module '*.gif'
declare module '*.svg'

declare module '*.html'

declare module '*.json' {
	const value: any;
	export default value;
}

declare module '*.scss'
declare module '*.css'

declare module 'twemoji';

declare module 'emojibase-data/*/compact.json' {
	import { CompactEmoji } from 'emojibase';
	const value: Array<CompactEmoji>;
	export default value;
}