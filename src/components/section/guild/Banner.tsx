/**
 * Guild banner
 * @namespace guild
 */

import * as React from 'react';

import css from './Banner.module.scss';
import Icon from '../../util/Icon';
import Channel from './Channel';

export default class Banner extends React.Component<{
    name: string,
    verified?: boolean,
    bannerURL?: string,
    scrollPosition?: number
}> {
    render() {
        let background: boolean = false;
        if(!this.props.bannerURL) background = true;
        else background = this.props.scrollPosition !== undefined && !isNaN(this.props.scrollPosition) && this.props.scrollPosition > (130 - 64);
        return (
            <div className={`${css.padding} ${this.props.bannerURL ? css.extended : ""}`}>
                <div className={css.wrapper}>
                    { this.props.bannerURL && (
                        <div className={css.banner} style={{ backgroundImage: `url("${this.props.bannerURL}")`, opacity: !background ? 1 : 0 }}>
                            <div className={css.overlay} />
                        </div>
                    )}

                    { this.props.bannerURL && <div className={css.padding} /> }
                    <div className={`${css.guildName} ${background ? css.background : ""}`}>
                        <img className={css.verified} src="/assets/icons/verified.svg"/>
                        <span className={css.name}>Overwatch</span>
                    </div>
                </div>
            </div>
        )
    }
}