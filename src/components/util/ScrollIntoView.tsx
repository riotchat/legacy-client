import * as React from 'react';

export default class ScrollIntoView extends React.Component<{scroll: boolean, onScrolled?: () => void}> {
    ref: React.RefObject<HTMLSpanElement>;
    constructor(props: any) {
        super(props);
        this.ref = React.createRef();
        this.scroll = this.scroll.bind(this);
    }
    
    componentDidMount() {
        if(this.props.scroll) this.scroll(this.props);
    }

    componentWillReceiveProps(props: {scroll: boolean, onScrolled?: () => void}) {
        if(props.scroll) this.scroll(props);
    }

    scroll(props: {onScrolled?: () => void}) {
        if(this.ref.current == undefined) return;
        this.ref.current.scrollIntoView();
        if(props.onScrolled) props.onScrolled();
    }

    render() {
        return <span ref={this.ref} />
    }
}