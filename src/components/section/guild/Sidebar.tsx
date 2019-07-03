/**
 * Guild-specific sidebar
 * @namespace guild
 */

import * as React from 'react';

import css from './Sidebar.module.scss';
import { scrollable } from '../../util/Scrollbar';
import Banner from './Banner';
import Channel from './Channel';
import ChannelCategory from './ChannelCategory';

let canManage = true;

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
			<div className={scrollable} style={{ height: "100%" }} onScroll={this.handleScroll}>
				<div className={css.guild}>
					<Banner name="Overwatch" verified={true} bannerURL="/assets/images/communities.jpg" scrollPosition={this.state.scroll} />
					<div className={css.helpWindow}>
						<div className={css.wrap}>
							<div className={css.content}>
								<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADtUlEQVRoQ+1Z3VHbQBD+Vg7yI3QQqCBQAaaC2CPyDFQQUwFQAe4A8xw8NhVgKsCpALsDeJQSaTOnsx3/SLrbkwzDDPfm8d7dfrff/orwwRd9cP3xCeC9LViZBbi/tY/YOwS4AWAXRPtL4JhHAMYADVFLHqn1R/0uvUoB4D52ENdPQGinSsvWGIwOauEttfAi2/pf2glAqnji/wSU4rTjernex0r5DgXRlcs5YgD860sDXu3G4cVN+o2RxGf04+/QJLj4vwgA9/wLgC4lF8hl+VJiDWsA3PNvADqVK+Syg7sURGc2O60AvK3yM7XtQBgBcM+/BOjC5jWql+ErCqJCyhYCmDrsQ/WKCU5M4qMix84FoENl/WkD0UagfSo6piDcy9uUD8CVOsyvIHTg8WCWbdMsnVATjDaItqUIgHwqZQKYJqpneZLi3/CiJrVUybC+uI9dJP4AoG8yEPwCL9rLytjZAHp1VRpciy5RL1+L9vOUn8cWBSL2Rw6WOKcg7KzqlAfgWc59c8SYg7jb6oA8VYpIVqYvrAHQfPWU88qWlxzYVphV3rEOwIU+ACgIjTll8UW4V2fZC6XSazRaB3DnD0D0XXr4mwBgvqfjqLmoWxaAp7VmxAbNW1AIeKQgVA3TfGVRyMW0qq43pv2STpxuX7V0lQBUrD6wCqOJ/yTPMRr+BgEoI/AItahVmMhiv+9E0an5NgsgvUS3iPD4frmUwInuJ8q1oBYA/JE81dt4eSUyFk7sGEYrUc90iFUYdUxkprsr+t8ikbmWEsAE4C4YI3CSPechbweE/Wlv/VUMKiPX5BVzqhy2vWCCJD6VjkOm3V5Xcg8F4drwrFw5zXyLWtR2nazpyZ7fAdGJhTUE5bQ+eFxYszPf0nFUyZiF7/xuIQjda+xaNzRpNDe1lF6oOqTMzsviNZdEdKdWVz1IzhK2lCkA3dSrCXK2L+ise+RKn3ldpK39UJCdJ1ncn+0vN1ZRIDg5lzrwXHmbOauhyjU2IUYqpebiAWrRuS2lUsrE/jWIlmr7DP5kOu6inBFAqp/JyeZPqj5iUBderJr216VaiHkb7DXAaFoVc5ZBwgqACITUg7PkLZVPy2vJfVZ0khyYLWukjZhCixscMqgtpAm8pGk72bCKQrlRWX9iaruPChdOno4iTVPoPF1EFFo9ZJorVDZWkzzb2ml2zEQ3PmG3TC4pBWCJWrqKbYC5AUq7rsMVwI9gfgHREF4ylFJlIxawJfcm5SqzwCaVLDr7E8B7vfzs3n8yALJArImkKwAAAABJRU5ErkJggg=="/>
								<span className={css.textTop}>Seems a bit empty up in here.</span>
								<span className={css.text}>How about adding some friends?</span>
								<button>Invite Friends</button>
							</div>
						</div>
					</div>
					<div style={{ margin: "0 12px" }}>
						<Channel name="home" type="home" canManage={canManage} />
						<Channel name="news" type="news" canManage={canManage} />
						<Channel name="general" type="text" canManage={canManage} />
						<Channel name="memes" type="text" unread={true} canManage={canManage} />
						<Channel name="Much Voice" type="voice" canManage={canManage} />
						<Channel name="YouTube" type="videoshare" status="Playing Random Video from YouTube" canManage={canManage} />
						<Channel name="uhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh" type="text" status="Currently testing text overflow, because you know what, this really grinds my gears for the love of god help me" pings={5} canManage={canManage} />
						<Channel name="everyone-pings" type="text" unread={true} pings={9999} canManage={canManage} />
						<ChannelCategory name="Much category" canManage={canManage}>
							<Channel name="very categorized" type="voice" canManage={canManage} />
						</ChannelCategory>
						<ChannelCategory name="Text Channels" canManage={canManage}>
							<Channel name="epicness" type="text" unread={true} canManage={canManage} />
						</ChannelCategory>

						<ChannelCategory name="Voice Channels" canManage={canManage}>
							<Channel name="voice" type="voice" pings={1} canManage={canManage} />
							<Channel name="theater" type="videoshare" status="Playing Something from YouTube" canManage={canManage} />
						</ChannelCategory>

						<ChannelCategory name="hahayes" canManage={canManage}>
							<Channel name="hahayes" type="text" canManage={canManage} />
							<Channel name="hahayes" type="text" canManage={canManage} />
							<Channel name="hahayes" type="text" canManage={canManage} />
							<Channel name="hahayes" type="text" active={true} canManage={canManage} />
							<Channel name="hahayes" type="text" canManage={canManage} />
							<Channel name="hahayes" type="text" canManage={canManage} />
							<Channel name="hahayes" type="text" canManage={canManage} />
							<Channel name="hahayes" type="text" canManage={canManage} />
							<Channel name="hahayes" type="text" canManage={canManage} />
							<Channel name="hahayes" type="text" canManage={canManage} />
						</ChannelCategory>
					</div>
				</div>
			</div>
		)
	}
}