import React, { useState } from 'react';
import { Link, useHistory  } from 'react-router-dom'
import axios from 'axios'

import config from '../../config/config'

function Navbar(props) {
    const [logoutText, setlogoutText] = useState(false)
    let history = useHistory();

    const logout = async () => {
        try {
            setlogoutText(!logoutText)
            await axios.get(`${config().url}/logout`, config().headers)
            localStorage.clear()
            history.push('/')
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="nav">
            <Link to='/home' style={{ textDecoration: 'none' }}>
                <p className="nav_item">HOME</p>
            </Link>
            <Link to='/account' style={{ textDecoration: 'none' }}>
                <p className="nav_item">ACCOUNT</p>
            </Link>
            <p className="nav_item" style={{cursor: 'pointer'}} onClick={logout}>{logoutText ? "LOGING OUT" : "LOG OUT"}</p>
        </div>
    );
}

export default Navbar;