import * as React from 'react';
import marked from 'marked';
import hljs from 'highlight.js';
import { Message as MessageClass } from 'riotchat.js/dist/internal/Message';

import css from './Message.module.scss';

let urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

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

export default class Message extends React.Component<{ message: MessageClass }> {
    render() {
        if(!this.props.message) return null;
        let parsed = "";
        if (this.props.message.content) {
            let tokens = marked.lexer(this.props.message.content.toString(), mdOptions);
            tokens.forEach((value, index, array) => {
                let intermediate = value;
                if(intermediate.type === "space")
                    intermediate = { type: "paragraph", text: "\n\n" };
                else if(intermediate.type === "heading" && intermediate.depth > 3) {
                    intermediate = { type: "paragraph", text: "#".repeat(intermediate.depth) + " " + intermediate.text + "\n" }
                }
                
                if(intermediate.type === "paragraph" || intermediate.type === "heading") {
                    intermediate.text = intermediate.text.replace(/\[(.+)\]\((.+)\)/g, "\\[$1\\]\\($2\\)");
                    intermediate.text = intermediate.text.replace(urlRegex, "[$&]($&)");
                }
                
                array[index] = intermediate;
            });
            parsed = marked.parser(tokens, mdOptions);
        }

        return (
            <div className={css.message}>
                <span className={css.content} dangerouslySetInnerHTML={{
                    __html: parsed
                }} />
                { (this.props.message.createdAt.getTime() !== this.props.message.updatedAt.getTime()) && (
                    <span></span>
                )}
            </div>
        )
    }
}