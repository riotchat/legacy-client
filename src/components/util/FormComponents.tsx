import * as React from 'react';

import css from './FormComponents.module.scss';
import lodash from 'lodash';
import { ThemeInfo } from './ExtendableComponent';
import { pubsub } from '../..';
import { isLight, hexToRgb } from '../../utilFuctions';
import Icon from './Icon';

export class Title extends React.Component {
    render() {
        return (
            <div className={css.categoryTitle}>{this.props.children}</div>
        )
    }
}

export class Description extends React.Component {
    render() {
        return (
            <div className={css.categoryDescription}>{this.props.children}</div>
        )
    }
}

export class Button extends React.Component {
    render() {
        return (
            <div className={css.title}>{this.props.children}</div>
        )
    }
}

export class Input extends React.Component<{placeholder: string}> {
    render() {
        return (
            <input type="text" className={css.input} placeholder={this.props.placeholder} />
        )
    }
}

export class Checkbox extends React.Component<{
    checked?: boolean,
    type?: "checkbox" | "radio" | "toggle",
    color?: string, // optional, will be accent color if undefined
    text: string,
    description?: string,
    onChecked?: (checked: boolean) => void
}, { themeInfo: ThemeInfo }> {
    checkboxWrapperId: string;
    checkboxId: string;
    constructor(props: any) {
        super(props);
        this.checkboxWrapperId = lodash.uniqueId("checkboxWrapper");
        this.checkboxId = lodash.uniqueId("checkbox");
        
        this.state = {
            themeInfo: localStorage.getItem("themeInfo") ? JSON.parse(localStorage.getItem("themeInfo") as any) : { accent: "7B68EE" }
        }

        this.updateTheme = this.updateTheme.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        pubsub.on('updateTheme', this.updateTheme);
    }

    componentWillUnmount() {
        pubsub.removeListener('updateTheme', this.updateTheme);
    }

    updateTheme(themeInfo: ThemeInfo) {
		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				themeInfo
			});
		});
	}

    toggle(e: React.MouseEvent, onCheckbox: boolean) {
        e.stopPropagation();
        if((this.props.type === "toggle" && !onCheckbox) || e.target instanceof HTMLLabelElement || !this.props.onChecked) return;
        this.props.onChecked(!this.props.checked);
    }

    render() {
        let type = this.props.type === undefined ? "checkbox" : this.props.type;
        let selectedColor = this.props.color || ("#" + this.state.themeInfo.accent);
        let hexColor = hexToRgb(selectedColor);

        let checkbox: React.ReactNode = (
            <div className={css.checkbox}>
                <input id={this.checkboxId} className={css.input} type="checkbox" checked={this.props.checked} onClick={(e) => this.toggle(e, true)} />
                <label htmlFor={this.checkboxId} style={this.props.checked ? {backgroundColor: ""} : {}}>
                    { type !== "radio" && <Icon className={css.check} icon="check" type="regular" /> }
                </label>
            </div>
        );

        return (
            <React.Fragment>
                <style>{`
                    #${this.checkboxWrapperId} {
                        --checkbox-color: ${selectedColor};
                        --checkbox-color-contrast: ${isLight(hexColor.r, hexColor.g, hexColor.b) ? "black" : "white"};
                    }
                `}</style>
                <div id={this.checkboxWrapperId} className={`${css.checkboxWrapper} ${css[`type-${type}`]} ${this.props.checked ? css.checked : ""}`} onClick={(e) => this.toggle(e, false)}>
                    { type !== "toggle" && checkbox }
                    <div className={css.text}>
                        <span className={css.title}>{this.props.text}</span>
                        { this.props.description && <span className={css.description}>{this.props.description}</span> }
                    </div>
                    { type === "toggle" && checkbox }
                </div>
            </React.Fragment>
        );
    }
}

export class RadioGroup extends React.Component<{ checkbox?: number, onChange?: (checkbox: number) => void }> {
    warningTriggered: boolean;
    constructor(props: any) {
        super(props);
        this.warningTriggered = false;
    }

    render() {
        return (
            <div>
                {React.Children.map(this.props.children, (child, index) => {
                    if(false) {
                        if(!this.warningTriggered) console.warn("RadioGroup has a child that is not a Checkbox");
                        this.warningTriggered = true;
                        return child;
                    }

                    return React.cloneElement(child as React.ReactElement<any>, {
                        checked: this.props.checkbox === index,
                        onChecked: (checked: boolean) => {
                            if(!checked) return;
                            if(this.props.onChange) this.props.onChange(index);
                        }
                    });
                })}
            </div>
        )
    }
}