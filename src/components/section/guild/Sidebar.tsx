/**
 * Guild-specific sidebar
 * @namespace guild
 */

import * as React from 'react';

import css from './Sidebar.module.scss';
import Icon from '../../util/Icon';
import { scrollable } from '../../util/Scrollbar';
import Banner from './Banner';
import Channel from './Channel';
import ChannelCategory from './ChannelCategory';

export default class HomeSidebar extends React.Component<{}, { scroll: number }> {
    constructor(props: any) {
        super(props);
        this.state = {
            scroll: 0
        }

        this.handleScroll = this.handleScroll.bind(this);
    }

    handleScroll(event: React.UIEvent<HTMLDivElement>) {
        this.setState({
            scroll: (event.target as HTMLDivElement).scrollTop
        });
    }

    render() {
        return (
            <div className={`${css.guild} ${scrollable}`} style={{ height: "100%" }} onScroll={this.handleScroll}>
                <Banner name="Overwatch" verified={true} bannerURL="/assets/images/communities.jpg" scrollPosition={this.state.scroll} />
                <div style={{ margin: "0 12px" }}>
                    <Channel name="home" type="home" />
                    <Channel name="news" type="news" />
                    <Channel name="general" type="text" />
                    <Channel name="memes" type="text" unread={true} />
                    <Channel name="Much Voice" type="voice" />
                    <Channel name="YouTube" type="videoshare" status="Playing Random Video from YouTube" />
                    <Channel name="uhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh" type="text" status="Currently testing text overflow, because you know what, this really grinds my gears for the love of god help me" pings={5} />
                    <Channel name="everyone-pings" type="text" unread={true} pings={9999} />
                    <ChannelCategory name="Much category">
                        <Channel name="very categorized" type="voice" />
                    </ChannelCategory>
                    <ChannelCategory name="Text Channels">
                        <Channel name="epicness" type="text" unread={true} />
                    </ChannelCategory>

                    <ChannelCategory name="Voice Channels">
                        <Channel name="voice" type="voice" pings={1} />
                        <Channel name="theater" type="videoshare" status="Playing Something from YouTube" />
                    </ChannelCategory>

                    <ChannelCategory name="hahayes">
                        <Channel name="hahayes" type="text" />
                        <Channel name="hahayes" type="text" />
                        <Channel name="hahayes" type="text" />
                        <Channel name="hahayes" type="text" />
                        <Channel name="hahayes" type="text" />
                        <Channel name="hahayes" type="text" />
                        <Channel name="hahayes" type="text" />
                        <Channel name="hahayes" type="text" />
                        <Channel name="hahayes" type="text" />
                        <Channel name="hahayes" type="text" />
                    </ChannelCategory>
                </div>
            </div>
        )
    }
}