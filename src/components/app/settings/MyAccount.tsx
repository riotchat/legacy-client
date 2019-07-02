import * as React from 'react';

import css from './MyAccount.module.scss';
import Icon from '../../util/Icon';
import { RiotClient } from '../../..';
import Tooltip from '@material-ui/core/Tooltip';

const idTooltip = `
This ID is unique to you and only you.
It allows you to have any username you
can think of, even if it might not be that
original. Also, you won't have to deal with
those random number tags (thank god)
`

export default class MyAccountPanel extends React.Component {
    render() {
        return (
            <div className={css.root}>
                <div className={css.account}>
                    <div className={css.pfp} style={{ backgroundImage: RiotClient.user.avatarURL }}>
                        <div className={css.edit}>
                            <Icon className={css.icon} icon="pencil"/>
                        </div>
                    </div>
                    <div className={css.details}>
                        <span className={css.name}>{RiotClient.user.username}</span>
                        <span className={css.id}>
                            <span className={css.title}>UID:</span>
                            <span className={css.copy}>{RiotClient.user.id}</span>
                            <Tooltip title={idTooltip}>
                                <span><Icon icon="help-circle" /></span>
                            </Tooltip>
                        </span>
                        <div className={css.securityEnabled}>
                            <Icon className={css.lock} icon="lock-alt" />
                            <span>2FA has been enabled on this account. Learn more</span>
                        </div>
                    </div>
                </div>
                <span className={css.category}>2FA Authentication</span>
                <button className={css.button}>View Backup Codes</button>
                <button className={css.button}>Remove 2FA</button>

                <span className={css.category}>Pending Community Strikes</span>
                <div className={css.timeline}>

                </div>
            </div>
        )
    }
}