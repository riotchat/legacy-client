import * as React from 'react';

import css from './FormComponents.module.scss';
import lodash from 'lodash';

export class Checkbox extends React.Component<{
    checked: boolean,
    type?: "checkbox" | "radio" | "toggle",
    color?: string, // optional, will be accent color if undefined
    text: string,
    description?: string,
    onChecked?: (checked: boolean) => void
}> {
    checkboxId: string;
    constructor(props: any) {
        super(props);
        this.checkboxId = lodash.uniqueId("checkbox");
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        if(!this.props.onChecked) return;
        this.props.onChecked(!this.props.checked);
    }

    render() {
        let type = this.props.type === undefined ? "checkbox" : this.props.type;
        let selectedColor = this.props.color || "var(--accent-color, rgb(160, 160, 160))";
        let style: React.CSSProperties = this.props.checked === true ? { backgroundColor: selectedColor, borderColor: selectedColor } : {};

        let checkbox: React.ReactNode = (
            <div className={css.checkbox}>
                <input id={this.checkboxId} className={css.input} type="checkbox" checked={this.props.checked} />
                <label htmlFor={this.checkboxId} style={this.props.checked ? {backgroundColor: ""} : {}}></label>
            </div>
        );

        return (
            <div className={`${css.checkboxWrapper} ${css[`type-${type}`]} ${this.props.checked ? css.checked : ""}`}
                style={type !== "toggle" ? style : {}} onClick={this.toggle}>
                { type !== "toggle" && checkbox }
                <div className={css.text}>
                    <span className={css.title}>{this.props.text}</span>
                    { this.props.description && <span className={css.description}>{this.props.description}</span> }
                </div>
                { type === "toggle" && checkbox }
            </div>
        );
    }
}