import * as React from 'react';

import css from './Appearance.module.scss';
import style from './Main.module.scss';
import Icon from '../../util/Icon';
import { ThemeInfo } from '../../util/ExtendableComponent';
import { pubsub } from '../../..';
import { Checkbox } from '../../util/FormComponents';

export default class AppearancePanel extends React.Component<{}, { themeInfo: ThemeInfo }> {
	constructor(props: {}) {
		super(props);
		this.state = {
			themeInfo: localStorage.getItem("themeInfo") ? JSON.parse(localStorage.getItem("themeInfo") as string) : { theme: "dark", accent: "7B68EE" }
		}

		this.updateTheme = this.updateTheme.bind(this);
	}
	
	componentDidMount() { pubsub.on('updateTheme', this.updateTheme); }
	componentWillUnmount() { pubsub.removeListener('updateTheme', this.updateTheme); }

	updateTheme(themeInfo: ThemeInfo) {
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				themeInfo
			});
		});
	}

	render() {
		let colors: Array<string> =
			["#7B68EE", "#3498DB", "#1ABC9C", "#F1C40F", "#FF7F50", "#E91E63", "#D468EE",
			"#594CAD", "#206694", "#11806A", "#C27C0E", "#CD5B45", "#AD1457", "#954AA8"];
		let hasCustomColor = colors.indexOf("#" + this.state.themeInfo.accent) === -1
		return (
			<div className={css.panel}>
                <div className={style.section}>
                    <div className={style.category}>Theme</div>
                        <div className={css.themePicker}>
                            <div className={css.theme}>
                                <div className={css.light} onClick={() => {
                                    pubsub.emit('updateTheme', Object.assign({}, this.state.themeInfo, { theme: "light" }))
                                }}>
                                    <img src="./assets/images/light.svg" draggable={false}/>
                                </div>
                                <span className={css.type}>Light</span>
                            </div>
                            <div className={css.theme}>
                                <div className={css.dark} onClick={() => {
                                    pubsub.emit('updateTheme', Object.assign({}, this.state.themeInfo, { theme: "dark" }))
                                }}>
                                    <img src="./assets/images/dark.svg" draggable={false}/>
                                </div>
                                <span className={css.type}>Dark</span>
                            </div>
                        </div>
                </div>
                <div className={style.section}>
                    <div className={style.category}>Accent Color</div>
                    <div className={css.colorPicker}>
                        <a className={css.customColor} style={{background: hasCustomColor ? "#" + this.state.themeInfo.accent : "grey"}}>
                            { hasCustomColor && (
                                <Icon className={css.check} icon="check" type="regular"/>
                            )}
                            <Icon className={css.edit} icon="brush"/>
                        </a>
                        <div className={css.colorGrid} style={{ gridTemplateColumns: "29px ".repeat(Math.floor(colors.length / 2)) }}>
                            {colors.map((value) => {
                                return (
                                    <a key={`acc${value}`} className={css.color} style={{ backgroundColor: value }} onClick={() => {
                                        pubsub.emit('updateTheme', Object.assign({}, this.state.themeInfo, { accent: value.substring(1) }))
                                    }}>
                                        { "#" + this.state.themeInfo.accent === value && (
                                            <Icon className={css.check} icon="check" type="regular"/>
                                        )}
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className={style.section}>
                    <div className={style.category}>Message Display</div>
                        <div className={css.radioButton}>
                            <label>
                                <input type="checkbox"/>
                            </label>
                            <span><b>Default:</b> Beautiful, sleek and modern.</span>
                        </div>
                        <div className={css.radioButton}>
                            <label>
                                <input type="checkbox"/>
                            </label>
                            <span><b>Compact:</b> Long live the IRC.</span>
                        </div>
                </div>
                <div className={style.section}>
                    <div className={style.category}>Sync Options</div>
					<Checkbox
						checked={true}
						text="Sync my preferences"
						description="Synchornize my appearance settings across my devices." />                    
                </div>
			</div>
		)
	}
}