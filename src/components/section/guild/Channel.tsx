import * as React from 'react';

import Icon from '../../../components/util/Icon';
import css from './Channel.module.scss';

export default class Channel extends React.Component<{
    name: string,
    type: "text" | "voice" | "videoshare" | "home" | "news",
    status?: string,
    unread?: boolean,
    pings?: number,
    active?: boolean,
    canManage?: boolean
}> {
    render() {
        return (
            <div className={css.channelWrapper}>
                <div className={`${css.channel} ${this.props.active ? css.active : ""}`} draggable={this.props.canManage}>
                    <span className={css.icon}>
                        { this.props.type === "home" && <Icon icon="home" /> }
                        { this.props.type === "news" && <Icon icon="news" /> }
                        { this.props.type === "text" && <Icon icon="chat" /> }
                        { this.props.type === "voice" && <Icon icon="support" type="regular"/> }
                        { this.props.type === "videoshare" && <Icon icon="movie" /> }
                    </span>
                    <div className={css.text}>
                        <span className={css.name}>{this.props.name}</span>
                        {this.props.status && <span className={css.status}>{this.props.status}</span>}
                    </div>
                </div>
                {this.props.unread && !this.props.pings && (
                    <span className={css.unread} />
                )}
                {this.props.pings && (
                    <span className={css.mention}>
                        {this.props.pings > 99 ? "99+" : this.props.pings}
                    </span>
                )}
            </div>
        )
    }
}