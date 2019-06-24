import * as React from 'react';
import marked from 'marked';

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
    tables: false,
    sanitize: true,
    xhtml: true,
};

export default class Message extends React.Component {
    render() {
        let parsed = "";
        if (this.props.children) {
            let tokens = marked.lexer(this.props.children.toString(), mdOptions);
            tokens.forEach((value, index, array) => {
                if(value.type === "space")
                    array[index] = { type: "paragraph", text: "\n\n" };
                else if(value.type === "heading" && value.depth > 3)
                    array[index] = { type: "paragraph", text: "#".repeat(value.depth) + " " + value.text + "\n" }
                
                if(value.type === "paragraph" || value.type === "heading") {
                    (array[index] as any).text = value.text.replace(/\[(.+)\]\((.+)\)/g, "\\[$1\\]\\($2\\)");
                    (array[index] as any).text = value.text.replace(urlRegex, "[$&]($&)");
                }

                console.log(array[index]);
            });
            parsed = marked.parser(tokens, mdOptions);
        }
        return (
            <div className={css.message}>
                <span className={css.content} dangerouslySetInnerHTML={{
                    __html: parsed
                }} />
            </div>
        )
    }
}