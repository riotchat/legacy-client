import * as React from 'react';
import mdi from '@mdi/font/scss/materialdesignicons.scss';

export default class Icon extends React.Component<{icon: string, className?: string}> {
    render() {
        return (
            <span className={`${this.props.className || ''} ${mdi['mdi']} ${mdi[`mdi-${this.props.icon}`]}`}></span>
        )
    }
}