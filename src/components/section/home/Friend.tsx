import * as React from 'react';

import css from './Friend.module.scss';
import Icon from '../../util/Icon';

import { User } from '../../../../../riot.js';

export default class Chat extends React.Component<{
	user: User,
	type?: "mutual" | "incoming" | "outgoing",
	hidden?: boolean
}> {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<div className={`${css.friend} ${this.props.hidden ? css.hidden : ""}`}>
				<div className={css.name}>
					<div className={css.avatar} style={{backgroundImage: `url(${this.props.user.avatarURL})`}}/>
					<span>{this.props.user.username}</span>
					{ (this.props.type === undefined || this.props.type === "mutual") && (
						<div className={css.status}>
							<span className={`${css.indicator} ${this.props.user.status !== undefined && css[this.props.user.status]}`} />
						</div>
					)}
				</div>
				{ this.props.type === undefined || this.props.type === "mutual" ? (
					<div className={css.mobileStatus}>
						<span className={`${css.indicator} ${this.props.user.status !== undefined && css[this.props.user.status]}`} />
					</div>
				) : (
					<div className={css.buttons}>
						{ this.props.type === "incoming" ? ([
							<div className={css.accept}>
								<Icon icon="user-plus" />
							</div>,
							<div className={css.decline}>
								<Icon icon="user-x" />
							</div>
						]) : (
							<div className={css.cancel}>
								<Icon icon="x" type="regular"/>
							</div>
						)}
					</div>
				)}
			</div>
		)
	}
}