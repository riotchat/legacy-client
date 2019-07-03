import * as React from 'React';
import { pubsub, streamerMode } from '../..';

export type StreamerMode = {
    enabled: boolean
}

export class StreamerModeComponent<P = {}, S = {}> extends React.Component<P, S & { streamerMode: StreamerMode }> {
    constructor(props: P) {
        super(props);
        (this.state as any) = {
            streamerMode
        }

        this.onStreamerModeUpdate = this.onStreamerModeUpdate.bind(this);
    }

    componentDidMount() {
        pubsub.on('streamerMode', this.onStreamerModeUpdate);
    }

    componentWillUnmount() {
        pubsub.removeListener('streamerMode', this.onStreamerModeUpdate);
    }

    onStreamerModeUpdate(streamerMode: StreamerMode) {
        console.log("update", streamerMode, this);
        this.setState((prevState) => {
            return Object.assign({}, prevState, {
                streamerMode
            });
        });
    }
}
