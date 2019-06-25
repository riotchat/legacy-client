import * as React from 'react';

import styles from './Chat.module.scss';
import Icon from '../../util/Icon';
import MessageBox from './MessageBox';

import MessageGroup from './MessageGroup';
import Message from './Message';

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
					<div className={styles.items}>
						<Icon className={styles.mobileMenu} icon="menu" type="regular" />
						<Icon className={styles.icon} icon="chat" />
						<div className={styles.nameWrapper}>
							<div className={styles.name}>chat</div>
						</div>
						<span className={styles.divider}/>
						<div className={styles.descWrapper}>
                    		<div className={styles.description}>come and hang out, talk about anything you like.</div>
						</div>
						<div className={styles.menu}>
                    		<Icon className={styles.menuIcon} icon="bell" />
							<Icon className={styles.feedback} icon="megaphone" />
						</div>
					</div>
				</div>
				<div className={styles.content}>
					<MessageGroup timestamp={1561287828} username="nizune" pfpURL="/assets/images/nizune.png">
						<Message>
							{`my name jeff`}
						</Message>
					</MessageGroup>
					<MessageGroup timestamp={1561287851} username="FatalErrorCoded" pfpURL="/assets/images/fatalerrorcoded.png">
						<Message>
							{`Hey nizune!`}
						</Message>
					</MessageGroup>
					<MessageGroup timestamp={1561287868} username="tech support scammer" pfpURL="https://owo.insrt.uk/rDWrK7q0XJ8MpKdHFPP-Q.png">
						<Message>
							{`Haha **yes**!\ntime to\nscam some\n\npeople`}
						</Message>
					</MessageGroup>
					<MessageGroup timestamp={1561290160} username="FatalErrorCoded" pfpURL="/assets/images/fatalerrorcoded.png">
						<Message>
							{`Test`}
						</Message>
						<Message>
							{`Single\nLine break`}
						</Message>
						<Message>
							{`Double\n\nLine break`}
						</Message>
						<Message>
							{`# Level 1\n## Level 2\n### Level 3\n#### Level 4\n##### Level 5\n###### Level 6`}
						</Message>
						<Message>
							{`> Block Quotes\n>Now this is great\n> - almighty fatal\n> > also you can have block quotes inside block quotes cause why the heck not`}
						</Message>
					</MessageGroup>
					<MessageGroup timestamp={1561304582} username="FatalErrorCoded" pfpURL="/assets/images/fatalerrorcoded.png">
						<Message>
							{`Testing links https://marked.js.org/#/USING_ADVANCED.md#options`}
						</Message>
						<Message>
							{`<b>This should be sanitized</b><script>alert('this is NOT sanitized!')</script>`}
						</Message>
					</MessageGroup>
					<MessageGroup timestamp={1561305347} username="nizune" pfpURL="/assets/images/nizune.png">
						<Message>
							{`here's a link to test: https://www.youtube.com/watch?v=dQw4w9WgXcQ`}
						</Message>
					</MessageGroup>
					<MessageGroup timestamp={1561305844} username="FatalErrorCoded" pfpURL="/assets/images/fatalerrorcoded.png">
						<Message>
							{`[Another link which should NOT work outside of embeds](https://i.kym-cdn.com/photos/images/newsfeed/001/170/001/c44.png)`}
						</Message>
						<Message>
							{`# [Link in a heading](https://i.kym-cdn.com/photos/images/newsfeed/001/170/001/c44.png)`}
						</Message>
					</MessageGroup>
				</div>
				<div className={styles.footer}>
					<MessageBox onSend={this.onSend} />
				</div>
			</div>
		);
	}
}