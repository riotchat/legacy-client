import * as React from 'react';
import mdi from '@mdi/font/scss/materialdesignicons.scss';
import boxicon from 'boxicons/css/boxicons.min.css';

import css from './Icon.module.scss';

export default class Icon extends React.Component<{icon: string, className?: string, type?: "regular" | "solid" | "logo", color?: string}, {svg?: string}> {
    mounted: boolean;
    constructor(props: any) {
        super(props);
        this.state = {
            svg: undefined
        }

        this.mounted = false;
    }

    componentDidMount() {
        this.mounted = true;
        let prefix = this.props.type === "regular" ? "bx" : this.props.type === "logo" ? "bxl" : "bxs";
        let type = this.props.type ? (this.props.type === "logo" ? "logos" : this.props.type) : "solid";
        import(`boxicons/svg/${type}/${prefix}-${this.props.icon}.svg`).then((svg) => {
            if(!this.mounted) return;
            this.setState({
                svg: svg.default
            });
        });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        if(this.state.svg) return (
            <span className={`${css.icon} ${this.props.className || ''}`} style={{ fill: this.props.color || "#E8E8E8" }} dangerouslySetInnerHTML={{ __html: this.state.svg }} />
        ); else return null;
    }
}