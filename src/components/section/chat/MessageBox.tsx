import * as React from 'react';
import Textarea from 'react-textarea-autosize';

import css from "./MessageBox.module.scss";
import Icon from '../../util/Icon';

export default class MessageBox extends React.Component<{ onSend: (message: string) => boolean }, { message: string }> {
	constructor(props: { onSend: (message: string) => boolean }) {
        super(props);
        this.state = {
            message: ""
        }

        this.onMessageChange = this.onMessageChange.bind(this);
        this.onMessageKeyPress = this.onMessageKeyPress.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onPaste = this.onPaste.bind(this);
	}

    onMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        let message = e.target.value;
        this.setState((prevState) => {
            return Object.assign({}, prevState, {
                message
            });
        });
    }

    onMessageKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if(e.charCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.onSubmit();
        }
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

    onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
        console.log(e.clipboardData);
    }

	render() {
		return (
            <div className={css.wrapper}>
                <span className={css.typeIndicator}></span>
                <div className={css.messageBox}>
                    <div className={css.textArea}>
                        <form onSubmit={this.onSubmit}>
                            <Textarea
                                maxRows={5}
                                value={this.state.message}
                                onChange={this.onMessageChange}
                                placeholder="Message User"
                                onKeyPress={this.onMessageKeyPress}
                                style={{ height: "19px" }}
                                onPaste={this.onPaste}
                            ></Textarea>
                        </form>
                    </div>
                    <div className={css.actionButton}>
                        <Icon icon="dots-vertical-rounded" type="regular" />
                    </div>
                </div>
            </div>
		)
	}
}