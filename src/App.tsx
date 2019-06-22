import * as React from 'react';

import styles from './App.module.scss';

import HomeSidebar from './components/section/home/Sidebar';
import Profile from './components/app/Profile';
import ServerIcon from './components/app/ServerIcon';
import Chat from './components/section/chat/Chat';
import { scrollable, hiddenScrollbar } from './components/util/Scrollbar';
import Icon from './components/util/Icon';

class App extends React.Component {
	theme: 'light' | 'dark';

	constructor(props: React.Props<{}>) {
		super(props);
		this.theme = 'dark';
	}

	render() {
		let test: Array<React.ReactNode> = [];
        for(let i = 0; i < 100; i++)
            test.push(<ServerIcon serverName="tech support scam time" iconURL="https://placeimg.com/240/240/nature" />);

		return (
			<div className={styles.root}>
				<div className={`${styles.sidebar} ${styles.main}`}>
					<div className={`${styles.guilds} ${hiddenScrollbar}`}>
						{test}
						<div className={styles.filler}></div>
					</div>
					<div className={styles.add}>
						<Icon icon="plus" />
					</div>
				</div>
				<div className={`${styles.sidebar} ${styles.browser}`}>
					<HomeSidebar />
					<Profile username="my name jeff" avatarURL="https://placeimg.com/240/240/nature" />
				</div>
				<Chat />
			</div>
		)
	}
}
	
export default App;