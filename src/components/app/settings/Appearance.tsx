import * as React from 'react';

import css from './Appearance.module.scss';
import style from './Main.module.scss';
import Icon from '../../util/Icon';
import { ThemeInfo, OptionsComponent } from '../../util/ExtendableComponent';
import { pubsub } from '../../..';
import { Checkbox, RadioGroup } from '../../../components/util/FormComponents';
import { setOptions } from '../../../utilFuctions';


export default class AppearancePanel extends OptionsComponent {
	render() {
		let colors: Array<string> =
			["#7B68EE", "#3498DB", "#1ABC9C", "#F1C40F", "#FF7F50", "#E91E63", "#D468EE",
			"#594CAD", "#206694", "#11806A", "#C27C0E", "#CD5B45", "#AD1457", "#954AA8"];
		let hasCustomColor = colors.indexOf("#" + this.state.options.themeInfo.accent) === -1
		return (
			<div className={css.panel}>
                <div className={style.section}>
                    <div className={style.category}>Theme</div>
                        <div className={css.themePicker}>
                            <div className={css.theme}>
                                <div className={css.light} onClick={() => {
                                    setOptions({ themeInfo: { theme: "light" } })
                                }}>
                                    <img src="./assets/images/light.svg" draggable={false} className={this.state.options.themeInfo.theme === "light" ? css.active : ""}/>
                                </div>
                                <span className={css.type}>Light</span>
                            </div>
                            <div className={css.theme}>
                                <div className={css.dark} onClick={() => {
                                    setOptions({ themeInfo: { theme: "dark" } })
                                }}>
                                    <img src="./assets/images/dark.svg" draggable={false} className={this.state.options.themeInfo.theme === "dark" ? css.active : ""}/>
                                </div>
                                <span className={css.type}>Dark</span>
                            </div>
                        </div>
                </div>
                <div className={style.section}>
                    <div className={style.category}>Accent Color</div>
                    <div className={css.colorPicker}>
                        <a className={css.customColor} style={{background: hasCustomColor ? "#" + this.state.options.themeInfo.accent : "grey"}}>
                            { hasCustomColor && (
                                <Icon className={css.check} icon="check" type="regular"/>
                            )}
                            <Icon className={css.edit} icon="brush"/>
                        </a>
                        <div className={`${css.colorGrid} ${css.disabled}`} style={{ gridTemplateColumns: "29px ".repeat(Math.floor(colors.length / 2)) }}>
                            {colors.map((value) => {
                                return (
                                    <a key={`acc${value}`} className={css.color} style={{ backgroundColor: value }} onClick={() => {
                                        setOptions({ themeInfo: { accent: value.substring(1) } })
                                    }}>
                                        { "#" + this.state.options.themeInfo.accent === value && (
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
                        <RadioGroup>
							<Checkbox type="radio" text="Default" description="Beautiful, sleek and modern."/>
							<Checkbox type="radio" text="Compact" description="Long live the IRC."/>
						</RadioGroup>
                </div>
                <div className={style.section}>
                    <div className={style.category}>Sync Options</div>
					<Checkbox
                        type="toggle"
						checked={true}
						text="Sync my preferences"
						description="Synchornize my appearance settings across my devices." />                    
                </div>
			</div>
		)
	}
}