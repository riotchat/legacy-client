import * as React from 'react';

import Icon from '../../util/Icon';
import css from './News.module.scss';

export class FavoriteUser extends React.Component {
    render() {
        return (
            <div className={css.user}></div>
        )
    }
}

export default class NewsTab extends React.Component {
    render() {
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
                </div>
                <div className={css.wrapper}>
                    <div className={css.category}>
                        <div className={css.title}>Favorites</div>
                        <div className={css.favoritesWrap}>
                            <div className={css.favorites}>
                                <FavoriteUser/>
                                <FavoriteUser/>
                                <FavoriteUser/>
                                <FavoriteUser/>
                                <FavoriteUser/>
                                <FavoriteUser/>
                                <FavoriteUser/>
                                <FavoriteUser/>
                                <FavoriteUser/>
                            </div>

                        </div>
                    </div>
                    <div className={css.category}>
                        <div className={css.title}>News</div>
                    </div>
                </div>
            </div>
        )
    }
}