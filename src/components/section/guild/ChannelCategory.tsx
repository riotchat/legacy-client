import * as React from 'react';

import Icon from '../../util/Icon';
import css from './ChannelCategory.module.scss';

export default class ChannelCategory extends React.Component<{
    name: string,
    initialState?: boolean,
    canManage?: boolean
}, { open: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = {
            open: props.initialState !== false
        }

        this.toggleCategory = this.toggleCategory.bind(this);
    }

    toggleCategory(event: React.MouseEvent<HTMLSpanElement>) {
        this.setState({
            open: !this.state.open
        });
    }

    render() {
        return (
            <div className={`${css.category} ${this.state.open ? css.active : ""}`} draggable={true}>
                <div className={css.wrapper}>
                    <span className={css.name} onClick={this.toggleCategory}>{this.props.name}</span>
                    { this.props.canManage && <Icon className={css.button} icon="plus" type="regular"/> }
                    <Icon className={css.caret} icon={this.state.open ? "caret-down" : "caret-right"} type="regular" onClick={this.toggleCategory} />
                </div>

                {React.Children.map(this.props.children, (value, index) => {
                    let props = (value as any).props;
                    if(this.state.open) return value;
                    else if(props !== undefined && (props.unread || props.pings || props.active)) return value;
                    else return null;
                })}
            </div>
        )
    }
}