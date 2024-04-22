import React from 'react';
import {NavLink} from "react-router-dom";

const Header = ({userName, setIsLoggedIn, setUserExists}) => {

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('userExists');
        setUserExists(null);
    };


    return (
        <div className="d-flex flex-row justify-content-end align-items-center">
            <h2 className="me-3 d-inline-block">
                Hello, {userName}!
            </h2>
            <button
                className="btn btn-outline-secondary d-inline-block"
                onClick={handleLogout}>
                <NavLink to='/' className="text-decoration-none text-light">Logout</NavLink>
            </button>
        </div>
    );
};

export default Header;