import * as React from 'react';

import styles from './Chat.module.scss';
import Icon from '../../util/Icon';

export default class Chat extends React.Component {
	render() {
		return (
			<div className={styles.root}>
				<div className={styles.header}>
					<Icon className={styles.icon} icon="message-text" />
					chat
                    <span className={styles.description}>come and hang out, talk about anything you like.</span>
                    <Icon className={styles.icon} icon="bell" />
				</div>
				<div className={styles.content}>epic</div>
				<div className={styles.footer}>epic</div>
			</div>
		);
	}
}