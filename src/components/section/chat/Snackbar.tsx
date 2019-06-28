import * as React from 'react';

import styles from './Snackbar.module.scss';
import Icon from '../../util/Icon';

export default class Chat extends React.Component<{
	text?: string,
	type?: "old" | "new" | "warning" | "error",
	icon?: string,
	iconType?: "regular" | "solid" | "logo",
	onDismiss?: () => void
}> {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<div className={`${styles.snackbar} ${(this.props.type && this.props.type !== "old") ? styles[this.props.type] : ""}`}>
				{this.props.icon && <Icon className={styles.timer} icon={this.props.icon} type={this.props.iconType ? this.props.iconType : "regular"} /> }
				<span>{this.props.text}</span>
				{this.props.onDismiss && <Icon className={styles.dismiss} icon="x" type="regular" onClick={this.props.onDismiss} />}
			</div>
		);
	}
}