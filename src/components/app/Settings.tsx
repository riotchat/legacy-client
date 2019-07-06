import * as React from 'react';
import Helmet from 'react-helmet';

import css from './Settings.module.scss';
import Icon from '../util/Icon'
import { scrollable } from '../util/Scrollbar';
import { RiotClient } from '../..';

import Banner from './settings/Banner';
import MyAccountPanel from './settings/MyAccount';
import VoiceVideoPanel from './settings/VoiceVideo';
import AppearancePanel from './settings/Appearance';
import AccessibilityPanel from './settings/Accessibility';
import StreamerModePanel from './settings/StreamerMode';
import { OptionsComponent } from '../util/ExtendableComponent';

export type SettingsPanelTabs = "account"
	| "authorized"
	| "integrations"
	| "voicevideo"
	| "appearance"
	| "accessibility"
	| "streamermode"
	| "pro"
	| "billing"
	| "language"
	| "developer"
	| "about"
	| "support"
	| "feedback"
	| undefined;

let tabToReadable = {
	account: "My Account",
	authorized: "Authorized Apps",
	integrations: "Integrations",
	
	voicevideo: "Voice & Video",
	appearance: "Appearance",
	accessibility: "Accessibility",
	streamermode: "Streamer Mode",

	pro: "Riot PRO",
	billing: "Billing",

	language: "Language",
	developer: "Developer Mode",

	about: "About",
	changelog: "Changelog",
	support: "Support",
	feedback: "Feedback"

}

class SettingsTab extends React.Component<{
	tabName: SettingsPanelTabs,
	displayName?: React.ReactNode
	icon?: React.ReactNode
	className?: string,
	active?: boolean,
	beta?: boolean,
	switchTo: (tab: SettingsPanelTabs) => void,
}> {
	render() {
		let renderedName: React.ReactNode = this.props.tabName ? tabToReadable[this.props.tabName] : "";
		if(this.props.displayName) renderedName = this.props.displayName;
		return (
			<div className={`${css.tab} ${this.props.active ? css.active : ""} ${this.props.className !== undefined ? this.props.className : ""}`} onClick={() => this.props.switchTo(this.props.tabName)}>
				<span className={css.icon}>{this.props.icon}</span>
				<span>{renderedName}</span>
				{this.props.beta && <span className={css.tag}>Beta</span>}
			</div>
		)
	}
}

export default class SettingsPanel extends OptionsComponent<{
	open: boolean,
	tab?: SettingsPanelTabs,
	onSwitchTab: (tab: SettingsPanelTabs) => void,
	onClose: () => void
}, { internalTab: SettingsPanelTabs }> {
	rootRef: React.RefObject<HTMLDivElement>;
	constructor(props: any) {
		super(props);
		this.state = Object.assign({}, this.state, {
			internalTab: props.tab
		});

		this.rootRef = React.createRef();
		this.logoutPrompt = this.logoutPrompt.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
	}

	componentDidMount() {
		super.componentDidMount();
		if(this.props.open && this.rootRef.current !== null) this.rootRef.current.focus();
	}

	componentWillReceiveProps(props: any) {
		if(props.open) this.setState((prevState) => {
			return Object.assign({}, prevState, {
				internalTab: props.tab
			});
		})
		if(props.open && this.rootRef.current !== null) this.rootRef.current.focus();
	}

	onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
		if(this.props.open && e.keyCode === 27) this.props.onClose();
	}

	logoutPrompt() {
		
	}
	
	render() {
		let bannerType: "unclaimed" | "streamerMode" | "strikeWarning" | undefined = undefined;
		if(this.state.options.streamerMode.enabled) bannerType = "streamerMode";

		return (
			<div className={`${css.root} ${this.props.open ? css.open : ""}`} onKeyDown={this.onKeyDown} tabIndex={0} ref={this.rootRef}>
				{this.props.open && <Helmet>
					{ this.state.options.themeInfo.theme === "dark" && !this.state.options.accessibility.highContrast
						&& <meta key="metaTheme" name="theme-color" content="#212121" /> }
					{ this.state.options.themeInfo.theme === "light" && !this.state.options.accessibility.highContrast
						&& <meta key="metaTheme" name="theme-color" content="#F0F0F0" /> }
				</Helmet> }
				<div className={css.mobileHeader}>
					{ this.state.internalTab !== undefined
						? <Icon className={css.close} icon="arrow-back" type="regular" onClick={() => this.props.onSwitchTab(undefined)} />
						: <Icon className={css.close} icon="x" type="regular" onClick={this.props.onClose} /> }
					<span className={css.headerText}>{this.state.internalTab ? tabToReadable[this.state.internalTab] : "Settings"}</span>
					<Icon icon="log-out" type="regular" onClick={this.logoutPrompt} />
				</div>
				<div className={`${css.closeButton} ${bannerType !== undefined ? css.hasBanner : ""}`} onClick={this.props.onClose}>
					<Icon className={css.close} icon="x" type="regular" onClick={this.props.onClose} />
				</div>
				<div className={`${css.settings} ${this.state.internalTab === undefined ? css.noTab : ""}`}>
					<div className={`${css.leftPanel} ${scrollable}`}>
						<div className={css.wrapper}>
							{bannerType && <Banner type={bannerType} mobile={true} /> }
							<div className={css.innerWrapper}>
								<div className={`${css.tab} ${css.account} ${this.state.internalTab === "pro" ? css.active : ""}`} onClick={() => this.props.onSwitchTab("account")}>
									<div className={css.pfp} style={{backgroundImage: `url("${RiotClient.user.avatarURL}")`}}/>
									<div className={css.details}>
										<span className={css.username}>{RiotClient.user.username}</span>
										{!this.state.options.streamerMode.enabled && (
											<React.Fragment>
												<span className={css.email}>E-Mail:</span>
												<span className={css.address}>{RiotClient.user.email}</span>
											</React.Fragment>
										)}
									</div>
								</div>
								<div className={css.category}>User Settings</div>
									<SettingsTab className={css.mobileHide} tabName="account" icon={<Icon icon="id-card" />} switchTo={this.props.onSwitchTab}
										active={this.state.internalTab === undefined || this.state.internalTab === "account"} />
									<SettingsTab tabName="authorized" icon={<Icon icon="check-shield" />} switchTo={this.props.onSwitchTab} active={this.state.internalTab === "authorized"} />
									<SettingsTab tabName="integrations" icon={<Icon icon="extension" />} switchTo={this.props.onSwitchTab} beta={true} active={this.state.internalTab === "integrations"} />
								<div className={css.category}>Riot PRO</div>
									<div className={`${css.tab} ${css.pro} ${this.state.internalTab === "pro" ? css.active : ""}`} onClick={() => this.props.onSwitchTab("pro")}>
										<div className={css.bg} />
										<span>{tabToReadable['pro']}</span>
									</div>
									<SettingsTab tabName="billing" icon={<Icon icon="credit-card"/>} switchTo={this.props.onSwitchTab} active={this.state.internalTab === "billing"} />
								<div className={css.category}>Client Settings</div>
									<SettingsTab tabName="voicevideo" icon={<Icon icon="microphone"/>} switchTo={this.props.onSwitchTab} active={this.state.internalTab === "voicevideo"} />
									<SettingsTab tabName="appearance" icon={<Icon icon="brush"/>} switchTo={this.props.onSwitchTab} active={this.state.internalTab === "appearance"} />
									<SettingsTab tabName="accessibility" icon={<Icon icon="body" type="regular"/>} switchTo={this.props.onSwitchTab} active={this.state.internalTab === "accessibility"} />
									<SettingsTab tabName="streamermode" icon={<Icon icon="slideshow"/>} switchTo={this.props.onSwitchTab} beta={true} active={this.state.internalTab === "streamermode"} />
									<SettingsTab tabName="language" icon={<Icon icon="globe" type="regular"/>} switchTo={this.props.onSwitchTab} active={this.state.internalTab === "language"} />
									<SettingsTab tabName="developer" icon={<Icon icon="wrench"/>} switchTo={this.props.onSwitchTab} active={this.state.internalTab === "developer"} />
								<div className={css.category}>About</div>
									<SettingsTab tabName="about" icon={<Icon icon="info-circle"/>} switchTo={this.props.onSwitchTab} active={this.state.internalTab === "about"} />
									<div className={css.tab}>
										<span className={css.icon}><Icon icon="file" type="regular"/></span>
										<span>{tabToReadable["changelog"]}</span>
									</div>
									<SettingsTab tabName="support" icon={<Icon icon="help-circle"/>} switchTo={this.props.onSwitchTab} active={this.state.internalTab === "support"} />
									<SettingsTab tabName="feedback" icon={<Icon icon="megaphone"/>} switchTo={this.props.onSwitchTab} active={this.state.internalTab === "feedback"} />
									<div className={`${css.tab} ${css.mobileHide} ${css.logoutButton}`} onClick={this.logoutPrompt}>
										<span className={css.icon}><Icon icon="log-out" type="regular" /></span>
										<span>Log Out</span>
									</div>
							</div>
							<div className={css.branding}>
								<img src="/assets/downloads/branding/logo-white-full.svg" draggable={false}/>
								<span className={css.version}>Version 0.0.10</span>
							</div>
						</div>
					</div>
					<div className={css.rightPanel}>
						{bannerType && <Banner type={bannerType} mobile={false} /> }
						<div className={`${css.wrapper} ${scrollable} ${bannerType ? css.hasBanner : ""}`}>
							<div className={css.innerWrapper}>
								<div className={css.title}>
									{this.state.internalTab && this.state.internalTab !== "account" && tabToReadable[this.state.internalTab]}
								</div>
								{ (this.state.internalTab === undefined || this.state.internalTab === "account") && <MyAccountPanel /> }
								{ this.state.internalTab === "voicevideo" && <VoiceVideoPanel/> }
								{ this.state.internalTab === "appearance" && <AppearancePanel/> }
								{ this.state.internalTab === "accessibility" && <AccessibilityPanel/> }
								{ this.state.internalTab === "streamermode" && <StreamerModePanel/> }
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}