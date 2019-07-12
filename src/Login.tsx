import * as React from 'react';

import css from './Login.module.scss';

const Login: React.FunctionComponent = (props) => (
    <div className={css.login}>
        <div className={css.overlay} />
        <div className={css.left}>
            <img className={css.logo} src="/assets/downloads/branding/logo-white-full.svg" draggable={false}/>
        </div>
        <div className={css.right}>
            <form className={css.form}>
                <div className={css.welcome}>Welcome back!</div>
                <span className={css.title}>E-Mail</span>
                <input type="email"/>
                <span className={css.title}>Password</span>
                <input type="password" />
                <a className={css.link} href="x">Forgot your password?</a>
                <input type="submit" value="Log in"/>
                <span className={css.signin}>Need an account? <a className={css.link} href="x">Sign up</a></span>
            </form>
        </div>
    </div>
)

export default Login;