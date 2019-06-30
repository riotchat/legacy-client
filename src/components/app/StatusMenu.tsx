/**
 * Status Menu
 * @namespace statusmenu
 */

import * as React from 'react';
import css from './StatusMenu.module.scss';
import Icon from '../util/Icon';

export default class StatusMenu extends React.Component<{
    open?: boolean,
    onSet?: (status: "online" | "away" | "busy" | "invisible") => void
}> {
    render() {
        return (
            <div className={`${css.menu} ${this.props.open === false ? css.hidden : ""}`}>
                <div className={css.picker}>
                    <div className={css.status}>
                        <div className={css.dotAndName}>
                            <Icon className={css.icon} icon="user-voice"/>
                            <span className={css.name}>Set custom status</span>
                        </div>
                    </div>
                    <div className={css.divider} />
                    <div className={css.status}>
                        <div className={css.dotAndName}>
                            <span className={`${css.dot} ${css.online}`}/>
                            <span className={css.name}>Online</span>
                        </div>
                    </div>
                    <div className={css.status}>
                        <div className={css.dotAndName}>
                            <span className={`${css.dot} ${css.away}`}/>
                            <span className={css.name}>Away</span>
                        </div>
                    </div>
                    <div className={css.status}>
                        <div className={css.dotAndName}>
                            <span className={`${css.dot} ${css.busy}`}/>
                            <span className={css.name}>Busy</span>
                        </div>
                    </div>
                    <div className={css.status}>
                        <div className={css.dotAndName}>
                            <span className={css.dot}/>
                            <div className={css.nameWrapper}>
                                <span className={css.name}>Invisible</span>
                                <span className={css.description}>You will appear offline to others, but will have full access to Riot.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}