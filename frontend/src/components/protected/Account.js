import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { FaUserAlt } from "react-icons/fa";
import Modal from 'react-modal';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { IoIosEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

import Auth from '../authenticate/authenticate'
import Navbar from '../partials/Navbar';
import config from '../../config/config'

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
        padding: '80px 40px',
        border: 'none',
        boxShadow: '0 0 6px rgba(25, 25, 34, .16)'
    }
};

function Account(props) {
    const [user, setUser] = useState({})
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [resetText, setResetText] = useState(false)

    const history = useHistory();

    const password = useRef(null)
    const newPassword = useRef(null)

    useEffect(() => {
        !Auth.getAuth() && history.push('/')
        axios
            .get(`${config().url}/user`, config().headers)
            .then(res => {
                setUser(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [history])

    const openModal = () => {
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

    const show = (number) => {
        if (number === 1) {
            password.current.type = password.current.type === 'password' ? 'text' : 'password'
            setShowPassword(!showPassword)
        } else {
            newPassword.current.type = newPassword.current.type === 'password' ? 'text' : 'password'
            setShowNewPassword(!showPassword)
        }
    }

    const createNotification = (type, message) => {
        switch (type) {
            case 'success':
                NotificationManager.success('Successfully changed password', '', 3000);
                break;
            case 'error':
                NotificationManager.error(message, '', 2000);
                break;
            default:
                return ''
        }
    }

    const reset = (e) => {
        e.preventDefault()
        if (password.current.value.length < 6) {
            return createNotification('error', 'Please put a password with 6 or more characters')
        }
        if (newPassword.current.value.length < 6) {
            return createNotification('error', 'Please put a new password with 6 or more characters')
        }
        if (password.current.value === newPassword.current.value) {
            return createNotification('error', 'Please put a new password different from the old one')
        }
        setResetText(!resetText)
        const request = {
            password: password.current.value,
            newPassword: newPassword.current.value
        }

        axios.post(`${config().url}/reset`, request, config().headers)
            .then(response => {
                setResetText(false)
                if (response.data === 'Your password has been changed successfully') {
                    createNotification('success', response.data)
                    password.current.value = ''
                    newPassword.current.value = ''
                    closeModal()
                    return
                }
                createNotification('error', response.data)
            })
            .catch(e => console.log(e))
    }

    const displayUser = (user) => {
        if (user._id) {
            return (
                <div className="user_card" style={{ height: '380px' }}>
                    <div className="user_main">
                        <div className="user_icon_holder">
                            <FaUserAlt className="user_icon" />
                        </div>
                        <div className="user_row">
                            <p className="user_name">{`${user.firstName} ${user.lastName}`}</p>
                        </div>
                        <div className="user_row">
                            <p className="user_email">{user.email}</p>
                        </div>
                    </div>
                    <div className="user_job_row">
                        <p className="user_job">{user.job}</p>
                    </div>
                </div>
            )
        } else {
            return (
                <p>Loading User</p>
            )
        }
    }

    return !Auth.getAuth() ? <Redirect to={{
        pathname: "/"
    }}
    /> : (
            <div data-test="AccountComponent">
                <NotificationContainer />
                <Navbar />
                <div className="home">
                    <div className="home_headers">
                        <p className="users_paragraph">Account Details</p>
                        <div className="add_new_user" onClick={openModal}>
                            <p>Change Password</p>
                        </div>
                    </div>
                    <div className="account_details">
                        {displayUser(user)}
                    </div>
                </div>

                <Modal
                    isOpen={modalIsOpen}
                    // onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                >
                    <form onSubmit={reset} style={{ width: '50%', margin: '0 auto' }} id="mobile_form" class="mobile_change_padding">
                        <div className="login_password">
                            <input type="password" placeholder="Password" minLength="6" className="login_details_password" ref={password} required={true} />
                            {showPassword ? <IoMdEyeOff className="password_image" onClick={() => show(1)} /> : <IoIosEye className="password_image" onClick={() => show(1)} />}
                        </div>
                        <div className="login_password">
                            <input type="password" placeholder="New Password" minLength="6" className="login_details_password" ref={newPassword} required={true} />
                            {showNewPassword ? <IoMdEyeOff className="password_image" onClick={() => show(2)} /> : <IoIosEye className="password_image" onClick={() => show(2)} />}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button type="submit" className="login_button" id={resetText ? 'disable_button' : ''} disabled={resetText}>{resetText ? "Reseting" : "Reset Password"}</button>
                        </div>
                    </form>
                </Modal>
            </div>
        );
}

export default Account;