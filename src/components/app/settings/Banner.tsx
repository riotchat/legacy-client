import * as React from 'react';

import css from './Banner.module.scss';
import Icon from '../../util/Icon';
import { pubsub } from '../../..';

export default class AppearancePanel extends React.Component<{
    type: "streamerMode" | "strike" | "unclaimed",
    strikes?: number,
    mobile?: boolean
}> {
    render() {
        let rendered: React.ReactNode = undefined;
        if (this.props.type === "streamerMode") {
            rendered = [
                <div key="bannertitle" className={css.title}>
                    Streamer Mode Enabled
                </div>,
                <div key="bannertext" className={css.text}>
                    Sensitive information has been hidden.
                    <a onClick={() => {
                        pubsub.emit('openSettings', 'streamermode');
                    }}>Learn More</a>
                </div>
            ]
        } else if (this.props.type === "unclaimed") {
            rendered = [
                <div key="bannertitle" className={css.title}>
                    Unclaimed Account
                </div>,
                <div key="bannertext" className={css.text}>
                    Claim your account before it's too late.
                    <a onClick={() => {
                        pubsub.emit('openSettings', 'streamermode');
                    }}>Claim</a>
                </div>
            ]
        } else if (this.props.type === "strike") {
            let singularPlural = this.props.strikes === 1 ? "strike" : "strikes";
            rendered = (
                <div className={css.text}>
                    {`You have ${this.props.strikes !== undefined ? this.props.strikes : ""} pending community ${singularPlural}.`}
                    <a onClick={() => {
                        pubsub.emit('openSettings', 'helpcenter')
                    }}>Learn More.</a>
                </div>
            );
        }

        return (
            <div className={`${css.banner} ${this.props.mobile ? css.mobile : ""}`}>
                <div className={css.type}>
                    {rendered}
                </div>
            </div>
        )
    }
}