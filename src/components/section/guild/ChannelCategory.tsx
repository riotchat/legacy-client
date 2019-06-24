import * as React from 'react';

import Icon from '../../util/Icon';
import css from './ChannelCategory.module.scss';

export default class ChannelCategory extends React.Component<{name: string}> {
    render() {
        return (
            <div className={css.category} draggable={true}>
                <div className={css.wrapper}>
                    <span className={css.name}>{this.props.name}</span>
                    <Icon className={css.button} icon="plus" type="regular"/>
                    <Icon className={css.caret} icon="caret-down" type="regular"/>
                </div>
                {this.props.children}
            </div>
        )
    }
}