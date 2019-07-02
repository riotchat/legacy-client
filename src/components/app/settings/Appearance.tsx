import * as React from 'react';

import css from './Appearance.module.scss';
import Icon from '../../util/Icon';

export default class AppearancePanel extends React.Component {
    render() {
        return (
            <div className={css.panel}>
                <div className={css.category}>Theme</div>
                    <div className={css.themePicker}>
                        <div className={css.theme}>
                            <div className={css.light}>
                                <img src="./assets/images/dark.svg" draggable={false}/>
                            </div>
                            <span className={css.title}>Light</span>
                        </div>
                        <div className={css.theme}>
                            <div className={css.dark}>
                                <img src="./assets/images/dark.svg" draggable={false}/>
                            </div>
                            <span className={css.title}>Dark</span>
                        </div>
                    </div>
                <div className={css.category}>Accent Color</div>
                    <div className={css.colorPicker}>
                        <button className={css.customColor} style={{background: "grey"}}/>
                        <button className={css.color} style={{background: "#7B68EE"}}>
                            <Icon className={css.check} icon="check" type="regular"/>
                        </button>
                        <button className={css.color} style={{background: "red"}}/>
                        <button className={css.color} style={{background: "red"}}/>
                        <button className={css.color} style={{background: "red"}}/>
                        <button className={css.color} style={{background: "red"}}/>
                        <button className={css.color} style={{background: "red"}}/>
                        <button className={css.color} style={{background: "#F44336"}}/>
                        <button className={css.color} style={{background: "#C62828"}}/>
                    </div>
            </div>
        )
    }
}