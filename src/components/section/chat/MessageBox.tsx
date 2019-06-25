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
	}

    onMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            message: e.target.value
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
        let returnValue = this.props.onSend(this.state.message);
        if(returnValue === true) {
            this.setState({
                message: ""
            });
        }
	}

	render() {
		return (
            <div className={css.wrapper}>
                <span className={css.typeIndicator}></span>
                <div className={css.messageBox}>
                    <div className={css.textArea}>
                        <form onSubmit={this.onSubmit}>
                            <Textarea maxRows={5} value={this.state.message} onChange={this.onMessageChange} placeholder="Message User" onKeyPress={this.onMessageKeyPress} style={{ height: "19px" }}></Textarea>
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