import React from 'react';
import { ImSad } from 'react-icons/im';

const NotFound = () => {
    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <h1 className="mt-5">Page Not Found</h1>
            <ImSad className="mt-4" size={50} />
        </div>
    );
};

export default NotFound;