import * as React from 'react';
import css from './HeaderBanner.module.scss';
import Icon from '../util/Icon';

export default class HeaderBanner extends React.Component<{title: string, text?: string, onClose?: () => void}> {
    render() {
        return (
            <div className={css.banner}>
                <span className={css.title}>{this.props.title}</span>
                { this.props.text && <span className={css.divider} /> }
                <span className={css.text}>{this.props.text}</span>
                <Icon className={css.dismiss} icon="x" type="regular"/>
            </div>
        )
    }
}