import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { Redirect } from 'react-router-dom'

import Modal from 'react-modal';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { IoIosEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdTrash } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";

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
        height: '600px',
        padding: '80px 40px',
        border: 'none',
        boxShadow: '0 0 6px rgba(25, 25, 34, .16)',
        zIndex: 1000
    }
};

function Home(props) {
    const [users, setUsers] = useState([])
    const [user, setUser] = useState({})
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [registeringText, setregisteringText] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const firstName = useRef(null)
    const lastName = useRef(null)
    const job = useRef(null)
    const email = useRef(null)
    const password = useRef(null)

    useEffect(() => {
        axios
            .get(`${config().url}/users`, config().headers)
            .then(res => {
                setUsers(res.data)
            })
            .catch(err => {
                console.log(err)
            })

        axios
            .get(`${config().url}/user`, config().headers)
            .then(res => {
                setUser(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])


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

    const show = () => {
        password.current.type = password.current.type === 'password' ? 'text' : 'password'
        setShowPassword(!showPassword)
    }

    const createNotification = (type, message) => {
        switch (type) {
            case 'success':
                NotificationManager.success(message, '', 3000);
                break;
            case 'error':
                NotificationManager.error(message, '', 2000);
                break;
            default:
                return ''
        }
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
                createNotification('success', 'Successfully registered user')
                setUsers((user) => {
                    user.push({
                        firstName: firstName.current.value,
                        lastName: lastName.current.value,
                        job: job.current.value,
                        email: email.current.value
                    })
                    return user
                })
                closeModal()
            })
            .catch(e => console.log(e))
    }

    const deleteUser = (_id) => {
        let answer = true
        if (user._id === _id) {
            answer = window.confirm('Are you sure you want to delete your own account?')
        }
        if (!answer) {
            return
        }
        const newUsers = users.filter(user => user._id !== _id)
        setUsers(newUsers)

        axios
            .delete(`${config().url}/user`, { ...config().headers, data:  { _id } })
            .then(res => {
                createNotification('success', 'Successfully deleted user')
            })
            .catch(err => {
                console.log(err)
            })
        if (!newUsers.length || user._id === _id) {
            props.history.push('/register')
            localStorage.clear()
        }
    }

    const displayUsers = (users) => {
        if (users.length) {
        return users.map((user, index) => {
            return (
                <div key={index} className="user_card" data-test="userComponent">
                    <div className="delete_user">
                        <IoMdTrash className="delete_user_icon" onClick={() => deleteUser(user._id)} />
                    </div>
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
        })
        } else {
            return (
                <p>Loading Users</p>
            )
        }
    }

    return !Auth.getAuth() ? <Redirect to={{pathname: "/"
    }}
    /> : (
        <div data-test="HomeComponent">
            <NotificationContainer />
            <Navbar />
            <div className="home">
                <div className="home_headers">
                    <p className="users_paragraph">Users</p>
                    <div className="add_new_user" onClick={openModal}>
                        <p>Add New User</p>
                        <FaUserAlt className="add_user_icon" />
                    </div>
                </div>
                <div className="users">
                    {displayUsers(users)}
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                // onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <form onSubmit={register} style={{ width: '50%', margin: '0 auto' }} id="mobile_form">
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
            </Modal>
        </div>
    );
}

export default Home;