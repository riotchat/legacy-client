import * as React from 'react';
import twemoji from 'twemoji';

import emoteData from 'emojibase-data/en/compact.json';
let parsedEmoteData: Array<string> = emoteData.map((value) => {
	return twemoji.parse(value.unicode);
});

console.log(parsedEmoteData);

let groups: Array<string> = [
	"Smileys",
	"People",
	"Skin Tones & Hair",
	"Nature",
	"Food & Drinks",
	"Travel",
	"Activities",
	"Objects",
	"Symbols",
	"Flags"
];

import css from './EmojiPicker.module.scss';
import { scrollable } from '../../util/Scrollbar';
import Icon from '../../util/Icon';

export default class EmojiPicker extends React.Component<{
	absolute?: { top?: string, bottom?: string, left?: string, right?: string },
	onPick: (emote: string) => void,
	onClose?: () => void
}, { search: string }> {
	constructor(props: any) {
		super(props);
		this.state = {
			search: ""
		}

		this.updateSearch = this.updateSearch.bind(this);
	}

	updateSearch(e: React.ChangeEvent<HTMLInputElement>) {
		let value = e.target.value;
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				search: value
			});
		});
	}

	render() {
		let pickerStyle: React.CSSProperties = {}
		if(this.props.absolute) {
			pickerStyle.position = "absolute";
			pickerStyle = Object.assign({}, pickerStyle, this.props.absolute);
		}

		return (
			<div className={css.picker} style={pickerStyle}>
				<div className={css.header}>
					<input className={css.search} type="text" placeholder="Don't be too picky..." value={this.state.search} onChange={this.updateSearch}/>
				</div>
				<div className={`${css.list} ${scrollable}`}>
					{ groups.map((groupValue, groupIndex) => {
						return (
							<div className={css.categoryWrapper}>
								<div className={css.categoryHeader}>{groupValue}</div>
								<div className={css.category}>
									{ emoteData.map((value, index) => {
										if(value.group !== groupIndex || value.shortcodes[0] === "eye_bubble") return;
										return <a className={css.emoji} onClick={() => {
											this.props.onPick(`:${value.shortcodes[0]}: `);
										}} dangerouslySetInnerHTML={{ __html: parsedEmoteData[index] }} />
									}) }
								</div>
							</div>
						)
					}) }
				</div>
				<div className={css.footer}>
					<div className={css.category}>
						<a id={css.people}><Icon icon="smiley-happy"/></a>
						<a id={css.nature}><Icon icon="tree"/></a>
						<a id={css.food}><Icon icon="cake"/></a>
						<a id={css.activities}><Icon icon="tennis-ball"/></a>
						<a id={css.travel}><Icon icon="compass"/></a>
						<a id={css.objects}><Icon icon="star"/></a>
						<a id={css.symbols}><Icon icon="heart"/></a>
						<a id={css.flags}><Icon icon="flag-alt"/></a>
					</div>
					<div className={css.tonePicker}>
                        <a id={css.skinTone}><Icon icon="face" color="#FFDC5D"/></a>
                        {/*<a id={css.skinTone}><Icon icon="face" color="#F7DECE"/></a>
                        <a id={css.skinTone}><Icon icon="face" color="#F3D2A2"/></a>
                        <a id={css.skinTone}><Icon icon="face" color="#D5AB88"/></a>
                        <a id={css.skinTone}><Icon icon="face" color="#AF7E57"/></a>*/}
					</div>
				</div>
			</div>
		);
	}
}