import * as React from 'react';

import Icon from '../../util/Icon';
import Friend from './Friend';
import { User } from 'riotchat.js';

import css from './FriendsList.module.scss';
import { scrollable } from '../../util/Scrollbar';

var testIncoming = new User("incoming", "1");
var testOutgoing = new User("outgoing", "2");

var test1 = new User("nizune", "69");
test1.avatarURL = "/assets/images/nizune.png";
test1.status = "online";

var test2 = new User("FatalErrorCoded", "1337");
test2.avatarURL = "/assets/images/fatalerrorcoded.png";
test2.status = "busy";

var test3 = new User("insert", "HAHAYES");
test3.avatarURL = "/assets/images/insert.png";
test3.status = "offline";

var friends: Array<User> = [test1, test2, test3];
var incoming: Array<User> = [testIncoming, test1];
var outgoing: Array<User> = [testOutgoing, test2, test3];

export default class FriendsList extends React.Component<{ openDrawer?: (drawer: "menu" | "members") => void }, { tab: "online" | "all" | "requests" }> {
    constructor(props: any) {
        super(props);
        this.state = {
            tab: "online"
        }

        this.setTab = this.setTab.bind(this);
    }

    // testing
    setTab(tab: "online" | "all" | "requests") {
        this.setState({ tab });
    }

    render() {
        return (
            <div className={css.main}>
                <div className={css.header}>
                    <div className={css.items}>
                        <div className={css.mobileMenu} onClick={(e) => { if (this.props.openDrawer) this.props.openDrawer("menu"); }}>
                            <Icon icon="menu" type="regular" />
                        </div>
                        <Icon className={css.icon} icon="user-detail" />
                        <div className={css.name}>Friends</div>
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
                            <span className={css.bar} />
                        </div>
                    </div>
                    <div className={css.menu}>
                        <Icon className={css.menuIcon} icon="user-plus" />
                        <Icon className={css.feedback} icon="megaphone" />
                    </div>
                </div>
                <div className={scrollable} style={{ height: "100%" }}>
                    <div className={css.friends}>
                        { this.state.tab !== "requests" ? (
                            friends.map((value, index) => {
                                let isOffline: boolean = value.status === "invisible" || value.status === "offline";
                                return <Friend key={`fm${value.id}`} user={value} type="mutual" hidden={this.state.tab === "online" && isOffline} />
                            })
                        ) : ([
                            <div className={css.incoming}>
                                <span className={css.incomingText}>Incoming</span>
                                {incoming.map((value, index) => {
                                    return <Friend key={`fi${value.id}`} user={value} type="incoming" />
                                })}
                            </div>,
                            <div className={css.divider}/>,
                            <div className={css.outgoing}>
                                <span className={css.outgoingText}>Outgoing</span>
                                {outgoing.map((value, index) => {
                                    return <Friend key={`fo${value.id}`} user={value} type="outgoing" />
                                })}
                            </div>
                        ])}
                    </div>
                </div>
            </div>
        )
    }
}