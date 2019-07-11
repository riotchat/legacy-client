import * as React from 'react';
import marked from 'marked';
import hljs from 'highlight.js';
import Tooltip from '@material-ui/core/Tooltip';
import { Message as MessageClass } from 'riotchat.js/dist/internal/Message';

import css from './Message.module.scss';
import moment from 'moment';
import { InnerMessageBox } from './MessageBox';
import Icon from '../../util/Icon';
import { RiotClient } from '../../..';

import emoteData from 'emojibase-data/en/compact.json';

let urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
let unicodeEmojiRegex = /\\:(\w+):/g;
let twemojiRegex = /:(\w+):/g;

const renderer = new marked.Renderer();
renderer.paragraph = (text) => {
	return text.replace(/\n/g, "<br />");
}

renderer.link = (href, title, text) => {
	return `<a href="${href}" target="_blank">${text}</a>`
}

const mdOptions: marked.MarkedOptions = {
	renderer,
	gfm: true,
	tables: false,
	sanitize: true,
	xhtml: true,
	highlight: (code, lang) => {
		try {
			return hljs.highlight(lang, code).value;
		} catch(e) {
			return code;
		}
	}
};

export default class Message extends React.Component<{ message: MessageClass }, { editing: boolean }> {
	messageBoxRef: React.RefObject<InnerMessageBox>;
	constructor(props: any) {
		super(props);
		this.messageBoxRef = React.createRef();
		this.state = {
			editing: false
		}

		this.onEdit = this.onEdit.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onButtonSubmit = this.onButtonSubmit.bind(this);
		this.onButtonCancel = this.onButtonCancel.bind(this);
	}

	componentWillReceiveProps(props: { message: MessageClass }) {
		if (props.message.content === this.props.message.content) return;
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				editing: false
			});
		});
	}

	async onEdit(message: string) {
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				editing: false
			});
		});

		if(message == "" || message === this.props.message.content) return;
		await this.props.message.edit(message);
	}

	onKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if(e.keyCode === 27) this.setState((prevState) => {
			return Object.assign({}, prevState, {
				editing: false
			});
		});
	}

	onButtonSubmit() {
		if(this.messageBoxRef.current) this.messageBoxRef.current.onSubmit();
	}

	onButtonCancel() {
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				editing: false
			});
		});
	}

	render() {
		if(!this.props.message) return null;
		if(!this.state.editing) {
			let parsed = "";
			if (this.props.message.content) {
				let onlyEmotes = this.props.message.content.replace(unicodeEmojiRegex, '').replace(twemojiRegex, '').trim().length === 0
					&& this.props.message.content.replace(unicodeEmojiRegex, 'h').replace(twemojiRegex, 'h').trim().length <= 15;
				let tokens = marked.lexer(this.props.message.content.toString(), mdOptions);
				// Token processing
				tokens.forEach((value, index, array) => {
					let intermediate = value;
					// Replace space between paragraphs with 2 newlines
					if(intermediate.type === "space")
						intermediate = { type: "paragraph", text: "\n\n" };
					// Disable headers smaller than level 3
					else if(intermediate.type === "heading" && intermediate.depth > 3) {
						intermediate = { type: "paragraph", text: "#".repeat(intermediate.depth) + " " + intermediate.text + "\n" }
					}
					// Filter out []() urls and URLify any URLs inside the text
					if(intermediate.type === "paragraph" || intermediate.type === "heading") {
						intermediate.text = intermediate.text.replace(/\[(.+)\]\((.+)\)/g, "\\[$1\\]\\($2\\)");
						intermediate.text = intermediate.text.replace(urlRegex, "[$&]($&)");
					}
					
					array[index] = intermediate;
				});
				
				parsed = marked.parser(tokens, mdOptions);
				/*parsed = twemoji.parse(parsed, {
					className: onlyEmotes ? css.emojiBig : css.emoji,
					folder: 'svg',
					ext: '.svg'
				});*/
				parsed = parsed.replace(unicodeEmojiRegex, (substring: string, shortcode: string) => {
					let found = emoteData.find((emote) => {
						for(let _shortcode of emote.shortcodes) {
							if(_shortcode === shortcode.toLowerCase()) return true;
						}
						return false;
					});
					if (found === undefined) return substring;
					return found.unicode;
				});

				parsed = parsed.replace(twemojiRegex, (substring: string, shortcode: string) => {
					let found = emoteData.find((emote) => {
						for(let _shortcode of emote.shortcodes) {
							if(_shortcode === shortcode.toLowerCase()) return true;
						}
						return false;
					});
					if (found === undefined) return substring;
					return `<img src="https://twemoji.maxcdn.com/2/svg/${found.hexcode.toLowerCase()}.svg" alt="${substring.toLowerCase()}"`
						+ ` draggable="false" class="${onlyEmotes ? css.emojiBig : css.emoji}">`;
				});
			}

			return (
				<div className={css.message}>
					<span className={css.content} dangerouslySetInnerHTML={{
						__html: parsed
					}} />
					{ (this.props.message.createdAt.getTime() !== this.props.message.updatedAt.getTime()) && (
						<Tooltip placement="top" title={ moment(this.props.message.updatedAt).calendar() }>
							<span className={css.editTag}>(edited)</span>
						</Tooltip>
					)}
					<span className={css.buttons}>
						<div className={css.reaction}>
							<Icon icon="smiley-happy" />
						</div>
						{this.props.message.author.id === RiotClient.user.id && (
							<div className={css.edit} onClick={() => { this.setState((prevState) => Object.assign({}, prevState, { editing: true }) ) }}>
								<Icon icon="pencil" />
							</div>
						)}
					</span>
				</div>
			)
		} else {
			return (
				<div className={css.message}>
					<InnerMessageBox
						ref={this.messageBoxRef}
						placeholder={this.props.message.content}
						initialMessage={this.props.message.content}
						full={false}
						className={css.editBox}
						autoFocus
						onKeyPress={this.onKeyPress}
						onSend={(message) => { this.onEdit(message); return true; }} />
					<span className={css.editNote} style={{ float: "right" }}>
						Press ESC to <a onClick={this.onButtonCancel}>
							cancel
						</a>, Enter to <a onClick={this.onButtonSubmit}>
							send
						</a>
					</span>
				</div>
			)
		}
	}
}