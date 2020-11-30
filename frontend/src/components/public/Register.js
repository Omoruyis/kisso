import React, { useRef, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { IoIosEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Modal from 'react-modal';

import config from '../../config/config'

import '../../App.css';
import 'react-notifications/lib/notifications.css';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(23, 22, 22, 0.88)'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '650px',
        height: '400px',
        padding: '10px 10px',
        border: 'none',
        boxShadow: '0 0 6px rgba(25, 25, 34, .16)',
        overflow: 'none'
    }
};

function Register(props) {
    const [showPassword, setShowPassword] = useState(false)
    const [registeringText, setregisteringText] = useState(false)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [displayPage, setDisplayPage] = useState(false)
    let history = useHistory();
    const firstName = useRef(null)
    const lastName = useRef(null)
    const job = useRef(null)
    const email = useRef(null)
    const password = useRef(null)

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('authenticated'))) {
            history.push('/home')
        }
        setDisplayPage(true)
    }, [history])

    const openModal = () => {
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

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
                NotificationManager.success('Successfully Registered', '', 3000);
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

    const register = (e) => {
        e.preventDefault()
        if (!firstName.current.value) {
            return createNotification('error', 'Please input a first name')
        }
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
        setregisteringText(!registeringText)
        const request = {
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            job: job.current.value,
            email: email.current.value,
            password: password.current.value
        }

        axios.post(`${config().url}/register`, request, config().headers)
            .then(response => {
                if (response.data === 'User already exists') {
                    firstName.current.value = ''
                    lastName.current.value = ''
                    job.current.value = ''
                    email.current.value = ''
                    password.current.value = ''
                    setregisteringText(false)
                    return createNotification('error', 'This account already exists')
                }
                setregisteringText(false)
                openModal()
            })
            .catch(e => console.log(e))
    }

    return (
        displayPage && (<div className="login_section" id="register_mobile_padding" data-test="registerComponent">
            <NotificationContainer />
            <p className="login">REGISTER</p>
            <form onSubmit={register} style={{ width: '100%' }}>
                <input type="text" placeholder="First Name*" className="login_details" ref={firstName} required={true} />
                <input type="text" placeholder="Last Name" className="login_details" ref={lastName} />
                <input type="text" placeholder="Job" className="login_details" ref={job} />
                <input type="email" placeholder="Email Address*" className="login_details" ref={email} required={true} />
                <div className="login_password">
                    <input type="password" placeholder="Password*" minLength="6" className="login_details_password" ref={password} required={true} />
                    {showPassword ? <IoMdEyeOff className="password_image" onClick={show} /> : <IoIosEye className="password_image" onClick={show} />}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type="submit" className="login_button" id={registeringText ? 'disable_button' : ''} disabled={registeringText}>{registeringText ? "Registering" : "Register"}</button>
                </div>
            </form>

            <div className="login_or signup_margin">
                <div className="login_underline"></div><p className="login_text">Or</p><div className="login_underline"></div>
            </div>
            <div className="login_create_account signup_margin">
                <p className="login_text" style={{ marginBottom: '0' }}>Already have an account?</p>
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <p className="move_sign_up">LOGIN</p>
                </Link>
            </div>

            <Modal
                isOpen={modalIsOpen}
                // onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <div style={{width: '100%'}}>
                    <div className="signup_modal">
                        <img src="https://res.cloudinary.com/dfjzditzc/image/upload/v1588971408/successful_aqpio3.jpg" alt="successful signup cover" className="successful_emoji" />
                        <div className="register_modal_text">
                            <p className="signup_successful_text">You have successfully signed up</p>
                            <p className="signup_successful_text">A confirmation email has been sent to your email address</p>
                        </div>
                    </div>
                    <div className="signup_modal_signin">
                        <Link to='/' style={{ textDecoration: 'none', fontSize: '25px' }}>Login</Link>
                    </div>
                </div>
            </Modal>
        </div>)
    );
}

export default Register;