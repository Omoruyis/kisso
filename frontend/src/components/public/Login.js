import React, { useRef, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { IoIosEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

import Auth from '../authenticate/authenticate'
import config from '../../config/config'

import '../../App.css';
import 'react-notifications/lib/notifications.css';

function Login(props) {
    const [showPassword, setShowPassword] = useState(false)
    const [loginText, setLoginText] = useState(false)
    const [displayPage, setDisplayPage] = useState(false)
    let history = useHistory();
    const email = useRef(null)
    const password = useRef(null)

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('authenticated'))) {
            history.push('/home')
        }
        setDisplayPage(true)
    }, [history])

    const validEmail = (email) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true
        } else {
            return false
        }
    }

    const createNotification = (type, message) => {
        switch (type) {
            case 'success':
                NotificationManager.success('Successfully Logged In', '', 3000);
                break;
            case 'error':
                NotificationManager.error(message, '', 2000);
                break;
            default:
                return ''
        }
    }

    const show = () => {
        password.current.type = password.current.type === 'password' ? 'text' : 'password'
        setShowPassword(!showPassword)
    }

    const login = (e) => {
        e.preventDefault()
        if (!email.current.value) {
            return createNotification('error', 'Please input an email address')
        }
        if (!password.current.value) {
            return createNotification('error', 'Please input a password')
        }
        if (!validEmail(email.current.value)) {
            createNotification('error', 'Invalid email address')
            return
        }
        setLoginText(!loginText)
        const request = {
            email: email.current.value,
            password: password.current.value
        }

        axios.post(`${config().url}/login`, request, config().headers)
            .then(res => {
                if (res.data.token) {
                    // createNotification('success')
                    Auth.authenticate()
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("name", `${res.data.firstName} ${res.data.lastName}`);
                    setLoginText(false)
                    history.push('/home')
                } else {
                    createNotification('error', res.data)
                    setLoginText(false)
                }
            })
            .catch(e => console.log(e))
    }

    return (
        displayPage && (<div className="login_section" data-test="loginComponent">
            <NotificationContainer />
            <p className="login">LOGIN</p>
            <form onSubmit={login} style={{ width: '100%' }}>
                <input type="email" placeholder="Email Address" className="login_details" ref={email} required={true} />
                <div className="login_password">
                    <input type="password" placeholder="Password" minLength="6" className="login_details_password" ref={password} required={true} />
                    {showPassword ? <IoMdEyeOff className="password_image" onClick={show} /> : <IoIosEye className="password_image" onClick={show} />}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type="submit" className="login_button" id={loginText ? 'disable_button' : ''} disabled={loginText}>{loginText ? "Logging In" : "Login"}</button>
                </div>
            </form>

            <div className="login_or">
                <div className="login_underline"></div><p className="login_text">Or</p><div className="login_underline"></div>
            </div>
            <div className="login_create_account">
                <p className="login_text" style={{ marginBottom: '0' }}>Don't have an account?</p>
                <Link to='/register' style={{ textDecoration: 'none' }}>
                    <p className="move_sign_up">REGISTER</p>
                </Link>
            </div>
        </div>)
    );
}

export default Login;