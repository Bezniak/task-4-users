import React from 'react';
import {Button} from "react-bootstrap";
import {NavLink} from "react-router-dom";

const ErrorMessage = ({message}) => (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="text-center fs-2">{message}</h1>
        <Button variant="outline-info" className="mx-3 w-25">
            <NavLink to="/login" className="text-decoration-none text-light">
                Login
            </NavLink>
        </Button>
    </div>
);

export default ErrorMessage;