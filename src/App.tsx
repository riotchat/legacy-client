import * as React from 'react';
import * as ReactDOM from 'react-dom';

import styles from './sass/index.module.scss';

class App extends React.Component {
	theme: 'light' | 'dark';

	constructor(props: React.Props<{}>) {
		super(props);
		this.theme = 'light';
	}

	render() {
		return(
			<div className={styles.root}>
				<div className={`${styles.sidebar} ${styles.main}`}>
					<div className={`${styles.guild}`}>server</div>
				</div>
				<div className={`${styles.sidebar} ${styles.browser}`}>
					second sidebar
					<div className={`${styles.sidebar} ${styles.browser}`}>
						profile div
					</div>
				</div>
				<div>stuff</div>
				<div className={`${styles.message} ${styles.input}`}>
					<form>

					</form>
				</div>
			</div>
		)
	}
}
	
export default App;