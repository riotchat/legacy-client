import * as React from 'react';
import marked from 'marked';
import hljs from 'highlight.js';
import twemoji from 'twemoji';
import Tooltip from '@material-ui/core/Tooltip';
import { Message as MessageClass } from 'riotchat.js/dist/internal/Message';

import css from './Message.module.scss';
import moment from 'moment';
import { InnerMessageBox } from './MessageBox';
import Icon from '../../util/Icon';
import { RiotClient } from '../../..';

let urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
let emojiRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

const renderer = new marked.Renderer();
renderer.paragraph = (text) => {
    return text.replace(/\n/g, "<br />");
}

renderer.link = (href, title, text) => {
    return `<a href="${href}" target="_blank">${text}</a>`
}

const mdOptions: marked.MarkedOptions = {
    renderer,
    gfm: true,
    tables: false,
    sanitize: true,
    xhtml: true,
    highlight: (code, lang) => {
        try {
            return hljs.highlight(lang, code).value;
        } catch(e) {
            return code;
        }
    }
};

export default class Message extends React.Component<{ message: MessageClass }, { editing: boolean }> {
    messageBoxRef: React.RefObject<InnerMessageBox>;
    constructor(props: any) {
        super(props);
        this.messageBoxRef = React.createRef();
        this.state = {
            editing: false
        }

        this.onEdit = this.onEdit.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onButtonSubmit = this.onButtonSubmit.bind(this);
        this.onButtonCancel = this.onButtonCancel.bind(this);
    }

    componentWillReceiveProps(props: { message: MessageClass }) {
        if (props.message.content === this.props.message.content) return;
        this.setState((prevState) => {
            return Object.assign({}, prevState, {
                editing: false
            });
        });
    }

    async onEdit(message: string) {
        this.setState((prevState) => {
            return Object.assign({}, prevState, {
                editing: false
            });
        });

        if(message == "" || message === this.props.message.content) return;
        await this.props.message.edit(message);
    }

    onKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if(e.keyCode === 27) this.setState((prevState) => {
            return Object.assign({}, prevState, {
                editing: false
            });
        });
    }

    onButtonSubmit() {
        if(this.messageBoxRef.current) this.messageBoxRef.current.onSubmit();
    }

    onButtonCancel() {
        this.setState((prevState) => {
            return Object.assign({}, prevState, {
                editing: false
            });
        });
    }

    render() {
        if(!this.props.message) return null;
        if(!this.state.editing) {
            let parsed = "";
            if (this.props.message.content) {
                let onlyEmotes = this.props.message.content.replace(emojiRegex, '') == "" && this.props.message.content.length <= 30;
                let tokens = marked.lexer(this.props.message.content.toString(), mdOptions);
                // Token processing
                tokens.forEach((value, index, array) => {
                    let intermediate = value;
                    // Replace space between paragraphs with 2 newlines
                    if(intermediate.type === "space")
                        intermediate = { type: "paragraph", text: "\n\n" };
                    // Disable headers smaller than level 3
                    else if(intermediate.type === "heading" && intermediate.depth > 3) {
                        intermediate = { type: "paragraph", text: "#".repeat(intermediate.depth) + " " + intermediate.text + "\n" }
                    }
                    // Filter out []() urls and URLify any URLs inside the text
                    if(intermediate.type === "paragraph" || intermediate.type === "heading") {
                        intermediate.text = intermediate.text.replace(/\[(.+)\]\((.+)\)/g, "\\[$1\\]\\($2\\)");
                        intermediate.text = intermediate.text.replace(urlRegex, "[$&]($&)");
                    }
                    
                    array[index] = intermediate;
                });
                
                parsed = marked.parser(tokens, mdOptions);
                parsed = twemoji.parse(parsed, {
                    className: onlyEmotes ? css.emojiBig : css.emoji,
                    folder: 'svg',
                    ext: '.svg'
                });
            }

            return (
                <div className={css.message}>
                    <span className={css.content} dangerouslySetInnerHTML={{
                        __html: parsed
                    }} />
                    { (this.props.message.createdAt.getTime() !== this.props.message.updatedAt.getTime()) && (
                        <Tooltip placement="top" title={ moment(this.props.message.updatedAt).calendar() }>
                            <span className={css.editTag}>(edited)</span>
                        </Tooltip>
                    )}
                    <span className={css.buttons}>
                        <div className={css.reaction}>
                            <Icon icon="smiley-happy" />
                        </div>
                        {this.props.message.author.id === RiotClient.user.id && (
                            <div className={css.edit} onClick={() => { this.setState((prevState) => Object.assign({}, prevState, { editing: true }) ) }}>
                                <Icon icon="pencil" />
                            </div>
                        )}
                    </span>
                </div>
            )
        } else {
            return (
                <div className={css.message}>
                    <InnerMessageBox
                        ref={this.messageBoxRef}
                        placeholder={this.props.message.content}
                        initialMessage={this.props.message.content}
                        full={false}
                        className={css.editBox}
                        autoFocus
                        onKeyPress={this.onKeyPress}
                        onSend={(message) => { this.onEdit(message); return true; }} />
                    <span className={css.editNote} style={{ float: "right" }}>
                        Press ESC to <a onClick={this.onButtonCancel}>
                            cancel
                        </a>, Enter to <a onClick={this.onButtonSubmit}>
                            send
                        </a>
                    </span>
                </div>
            )
        }
    }
}