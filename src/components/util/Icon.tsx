import * as React from 'react';
import mdi from '@mdi/font/scss/materialdesignicons.scss';
import boxicon from 'boxicons/css/boxicons.min.css';

import css from './Icon.module.scss';

type IconProps = {
	icon: string,
	className?: string,
	type?: "regular" | "solid" | "logo",
	color?: string,
	onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void
}

export default class Icon extends React.Component<IconProps, {svg?: string}> {
	mounted: boolean;
	constructor(props: any) {
		super(props);
		this.state = {
			svg: undefined
		}

		this.mounted = false;
		this.reloadIcon = this.reloadIcon.bind(this);
	}

	reloadIcon(props: IconProps) {
		let prefix = props.type === "regular" ? "bx" : props.type === "logo" ? "bxl" : "bxs";
		let type = props.type ? (props.type === "logo" ? "logos" : props.type) : "solid";
		import(`boxicons/svg/${type}/${prefix}-${props.icon}.svg`).then((svg) => {
			if(!this.mounted) return;
			this.setState({
				svg: svg.default
			});
		});
	}

	componentDidMount() {
		this.mounted = true;
		this.reloadIcon(this.props);
		
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	componentWillReceiveProps(props: IconProps) {
		if(props.icon !== this.props.icon && this.mounted) this.reloadIcon(props);
	}

	render() {
		if(this.state.svg) return (
			<span className={`${css.icon} ${this.props.className || ''}`}
				onClick={(e) => { if(typeof this.props.onClick === "function") this.props.onClick(e) }} dangerouslySetInnerHTML={{ __html: this.state.svg }} />
		); else return null;
	}
}