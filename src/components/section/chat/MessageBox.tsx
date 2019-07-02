import * as React from 'react';
import Textarea from 'react-textarea-autosize';

import css from "./MessageBox.module.scss";
import Icon from '../../util/Icon';
import { Channel } from 'riotchat.js';

export default class MessageBox extends React.Component<{ channelName: string, channelType: "chat" | "dm" | "self", onSend: (message: string) => boolean }> {
	constructor(props: { channelName: string, channelType: "chat" | "dm" | "self", onSend: (message: string) => boolean }) {
        super(props);
	}

	render() {
		return (
            <div className={css.wrapper}>
                <span className={css.typeIndicator}></span>
                <div className={css.messageBox}>
                    <InnerMessageBox
                        onSend={this.props.onSend} 
                        full={true}
                        placeholder={this.props.channelType === "self" ? "Save message" : `Message ${this.props.channelType === "dm" ? "@" : "#"}${this.props.channelName}`}
                    />
                    <Icon className={css.emojiButton} icon="smiley-happy"/>
                    <div className={css.actionButton}>
                        <Icon icon="dots-vertical-rounded" type="regular" />
                    </div>
                </div>
            </div>
		)
	}
}

export class InnerMessageBox extends React.Component<{
    initialMessage?: string,
    full?: boolean,
    placeholder?: string,
    className?: string,
    autoFocus?: boolean,
    onSend: (message: string) => boolean,
    onKeyPress?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}, { message: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            message: props.initialMessage || ""
        }

        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(props: { initialMessage?: string }) {
        if(this.props.initialMessage !== props.initialMessage) this.setState((prevState) => {
            return Object.assign({}, prevState, {
                message: props.initialMessage
            });
        });
    }

    onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        let message = e.target.value;
        this.setState((prevState) => {
            return Object.assign({}, prevState, {
                message
            });
        });
    }

    onKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if(e.charCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.onSubmit();
        }
    }

    onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if(!(e.keyCode === 13 && e.shiftKey === false) && this.props.onKeyPress)
            this.props.onKeyPress(e);
    }

    onSubmit(e?: React.FormEvent) {
        if(e !== undefined) e.preventDefault();
        this.setState((prevState) => {
            let returnValue = this.props.onSend(this.state.message);
            if(returnValue === true) {
                return Object.assign({}, prevState, {
                    message: ""
                });
            } else return prevState;
        });
	}

    render() {
        return (
            <div className={css.textArea}>
                <form onSubmit={this.onSubmit}>
                    <Textarea
                        maxRows={5}
                        value={this.state.message}
                        onChange={this.onChange}
                        placeholder={this.props.placeholder || "Message channel"}
                        onKeyPress={this.onKeyPress}
                        onKeyDown={this.onKeyDown}
                        style={{ height: "19px" }}
                        autoFocus={this.props.autoFocus === true}>
                    </Textarea>
                </form>
            </div>
        )
    }
}