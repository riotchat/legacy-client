/**
 * Guild banner
 * @namespace guild
 */

import * as React from 'react';

import css from './Banner.module.scss';
import Icon from '../../util/Icon';
import Channel from './Channel';

export default class Banner extends React.Component<{
	name: string,
	verified?: boolean,
	bannerURL?: string,
	scrollPosition?: number
}> {
	render() {
		let background: boolean = false;
		if(!this.props.bannerURL) background = true;
		else background = this.props.scrollPosition !== undefined && !isNaN(this.props.scrollPosition) && this.props.scrollPosition > (130 - 64);
		let backgroundOpacity: number = (this.props.scrollPosition !== undefined && !isNaN(this.props.scrollPosition))
			? (this.props.scrollPosition - (130 - 64)) / (130 - 64) : 0;

		return (
			<div className={`${css.padding} ${this.props.bannerURL ? css.extended : ""}`}>
				<div className={css.wrapper}>
					{ this.props.bannerURL && (
						<div className={css.banner} style={{ backgroundImage: `url("${this.props.bannerURL}")`, opacity: Math.abs(backgroundOpacity) }}>
							<div className={css.overlay} />
						</div>
					)}

					{ this.props.bannerURL && <div className={css.padding} /> }
					<div className={`${css.guildName} ${background ? css.background : ""}`}>
						{this.props.verified && <img className={css.verified} src="/assets/icons/verified.svg" /> }
						<span className={css.name}>{this.props.name}</span>
					</div>
				</div>
			</div>
		)
	}
}