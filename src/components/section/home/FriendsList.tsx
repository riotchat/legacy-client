import * as React from 'react';

import Icon from '../../util/Icon';
import Friend from './Friend';
import { User } from 'riotchat.js';

import css from './FriendsList.module.scss';
import { scrollable } from '../../util/Scrollbar';
import { RiotClient } from '../../..';
import Collection from 'riotchat.js/dist/util/Collection';

export default class FriendsList extends React.Component<{
	openDrawer?: (drawer: "menu" | "members") => void,
	openDM?: (user: string) => void
}, {
	friends: Collection<string, User>,
	tab: "online" | "all" | "requests"
}> {
	mounted: boolean;
	constructor(props: any) {
		super(props);
		this.mounted = false;
		this.state = {
			friends: new Collection<string, User>(),
			tab: "online"
		}

		this.setTab = this.setTab.bind(this);
		this.onUserUpdate = this.onUserUpdate.bind(this);
	}

	async componentDidMount() {
		this.mounted = true;
		RiotClient.on('userUpdate', this.onUserUpdate);
		if (!this.mounted) return;

		let friendsMap = new Collection<string, User>();
		RiotClient.users.forEach((user) => {
			if(user.relation === "unknown" || user.relation === "self") return;
			friendsMap.set(user.id, user);
		});

		this.setState((prevState) => {
			return Object.assign({}, prevState, {
				friends: friendsMap
			});
		});
	}

	componentWillUnmount() {
		this.mounted = false;
		RiotClient.removeListener('userUpdate', this.onUserUpdate);
	}

	setTab(tab: "online" | "all" | "requests") {
		this.setState((prevState) => {
			return Object.assign({}, prevState, { tab });
		});
	}

	onUserUpdate(user: User) {
		this.setState((prevState) => {
			let map = prevState.friends;
			if (user.relation !== "unknown" && user.relation !== "self") map.set(user.id, user);
			else if (map.get(user.id) !== undefined) map.delete(user.id);
			return Object.assign({}, prevState, {
				friends: map
			})
		});
	}

	render() {
		let hasIncoming = false;
		for(let user of this.state.friends.values()) {
			if (user.relation === "incoming") {
				hasIncoming = true;
				break;
			}
		};

		return (
			<div className={css.main}>
				<div className={css.header}>
					<div className={css.items}>
						<div className={css.mobileMenu} onClick={(e) => { if (this.props.openDrawer) this.props.openDrawer("menu"); }}>
							<Icon icon="menu" type="regular" />
						</div>
						<div className={css.title}>
							<Icon className={css.icon} icon="user-detail" />
							<div className={css.name}>Friends</div>
						</div>
					</div>
					<div className={css.tabs}>
						<div className={`${css.tab} ${this.state.tab === "online" ? css.active : ""}`} onClick={(e) => this.setTab("online")}>
							<span>Online</span>
							<span className={css.bar} />
						</div>
						<div className={`${css.tab} ${this.state.tab === "all" ? css.active : ""}`} onClick={(e) => this.setTab("all")}>
							<span>All</span>
							<span className={css.bar} />
						</div>
						<div className={`${css.tab} ${this.state.tab === "requests" ? css.active : ""}`} onClick={(e) => this.setTab("requests")}>
							<span>Requests</span>
							<span className={`${css.incomingBar} ${hasIncoming ? css.active : ""}`} />
							<span className={css.bar} />
						</div>
					</div>
					<div className={css.menu}>
						<Icon className={css.menuIcon} icon="user-plus" onClick={async () => {
							let userId = prompt("Enter a User ID to add them to your friends list:");
							if (userId === null) return;
							try {
								let user = await RiotClient.fetchUser(userId);
								await user.addFriend();
								alert(`Sent request to ${user.username}!`);
							} catch(e) {
								alert(`Couldn't add user with ID ${userId} to your friend list!`);
							}
						}} />
					</div>
				</div>
				<div className={scrollable} style={{ height: "100%" }}>
					<div className={css.friends}>
						{ this.state.tab !== "requests" && (
							this.state.friends.array().map((value, index) => {
								if(value.relation !== "active") return null;
								let isOffline: boolean = value.status === "invisible" || value.status === "offline";
								return (
									<Friend
										key={`fm${value.id}`}
										user={value}
										type="mutual"
										hidden={this.state.tab === "online" && isOffline}
										onClick={() => { if(this.props.openDM) this.props.openDM(value.id); }}
									/>
								);
							})
						)}
						{ this.state.tab === "requests" && (
							<div className={css.incoming}>
								<span className={css.incomingText}>Incoming</span>
								{this.state.friends.array().map((value, index) => {
									if (value.relation !== "incoming") return null;
									return <Friend key={`fi${value.id}`} user={value} type="incoming" />
								})}
							</div>
						)}
						{ this.state.tab === "requests" && <div className={css.divider}/> }
						{ this.state.tab === "requests" && ( 
							<div className={css.outgoing}>
								<span className={css.outgoingText}>Outgoing</span>
								{this.state.friends.array().map((value, index) => {
									if (value.relation !== "pending") return null;
									return <Friend key={`fo${value.id}`} user={value} type="outgoing" />
								})}
							</div>
						)}
					</div>
				</div>
			</div>
		)
	}
}