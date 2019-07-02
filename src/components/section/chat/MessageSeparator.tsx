import * as React from 'react';
import moment from 'moment';

import css from './MessageSeparator.module.scss';

export default class MessageSeparator extends React.Component<{ separation?: "timestamp" | "new", timestamp?: Date | number }> {
    render() {
        return (
            <div className={`${css.separator} ${this.props.separation === "new" ? css.new : ""}`}>
                <div className={css.bar} />
                <span className={css.text}>
                    { this.props.separation === "new" ? "New Messages" : moment(this.props.timestamp || 0).format('LL') }
                </span>
                <div className={css.bar} />
            </div>
        );
    }
}