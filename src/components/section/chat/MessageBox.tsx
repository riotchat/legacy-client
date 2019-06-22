import * as React from 'react';

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
			<div>
				<form onSubmit={this.onSubmit}>
					<textarea value={this.state.message} onChange={this.onMessageChange} onKeyPress={this.onMessageKeyPress}></textarea>
				</form>
			</div>
		)
	}
}