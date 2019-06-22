import * as React from 'react';

import styles from './Chat.module.scss';
import Icon from '../../util/Icon';
import MessageBox from './MessageBox';

export default class Chat extends React.Component<{}> {
	constructor(props: {}) {
		super(props);

		this.onSend = this.onSend.bind(this);
	}

	onSend(message: string): boolean {
		console.log(message);
		return true;
	}

	render() {
		return (
			<div className={styles.root}>
				<div className={styles.header}>
					<Icon className={styles.icon} icon="message-text" /><span>chat</span>
					<span className={styles.divider}/>
                    <span className={styles.description}>come and hang out, talk about anything you like.</span>
                    <Icon className={styles.icon} icon="bell" />
				</div>
				<div className={styles.content}>epic</div>
				<div className={styles.footer}>
					<MessageBox onSend={this.onSend} />
				</div>
			</div>
		);
	}
}