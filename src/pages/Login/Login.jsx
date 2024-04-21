import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from '../../components/Table/Table';
import Header from "../../components/Header/Header";

const Login = () => {
    const [loginError, setLoginError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userExists, setUserExists] = useState(null);
    const [blockError, setBlockError] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm({
        shouldUnregister: true,
    });

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        const userData = localStorage.getItem('userExists');
        if (loggedInStatus === 'true' && userData) {
            setIsLoggedIn(true);
            setUserExists(JSON.parse(userData));
        }
    }, []);

    const handleLoginError = () => {
        setIsLoggedIn(false);
        setLoginError(true);
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('userExists');
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                process.env.REACT_APP_API_URL +
                `/app-users?filters[userEmail][$eq]=${data.userEmail}&filters[userPassword][$eq]=${data.userPassword}`
            );
            const userData = response.data.data[0];
            if (userData) {
                if (userData.attributes.status === 'blocked') {
                    setBlockError(true);
                } else {
                    setUserExists(userData);
                    setIsLoggedIn(true);
                    setLoginError(false);
                    setBlockError(false);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userExists', JSON.stringify(userData));
                }
            } else {
                handleLoginError();
            }
        } catch (error) {
            console.error(error);
            handleLoginError();
        }
        setIsLoading(false);
        reset();
    };


    return (
        <div className="container mt-4">
            {isLoggedIn && userExists && (
                <Header userName={userExists?.attributes?.userName} setUserExists={setUserExists}
                        setIsLoggedIn={setIsLoggedIn}/>
            )}
            <div
                className="container d-flex justify-content-center align-items-center position-absolute top-50 left-50">
                <div className="w-25">
                    {!isLoggedIn && (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group mb-3">
                                <label htmlFor="userEmail" className="mb-1 text-light">
                                    Login:
                                </label>
                                <input
                                    type="email"
                                    className={`form-control ${
                                        errors.userEmail ? 'is-invalid' : ''
                                    }`}
                                    placeholder="Email"
                                    {...register('userEmail', {
                                        required: 'Please enter your email',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Please enter a valid email address',
                                        },
                                    })}
                                />
                                {errors.userEmail && (
                                    <span className="invalid-feedback">
                                        {errors.userEmail.message}
                                    </span>
                                )}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="userPassword" className="mb-1 text-light">
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    className={`form-control ${
                                        errors.userPassword ? 'is-invalid' : ''
                                    }`}
                                    placeholder="Password"
                                    {...register('userPassword', {
                                        required: 'Please enter your password',
                                    })}
                                />
                                {errors.userPassword && (
                                    <span className="invalid-feedback">
                                        {errors.userPassword.message}
                                    </span>
                                )}
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-outline-secondary">
                                    {isLoading ? 'Loading...' : 'Login'}
                                </button>
                            </div>
                        </form>
                    )}
                    {loginError && !isLoggedIn && (
                        <div className="mt-3 alert alert-danger" role="alert">
                            Invalid email or password. Please try again.
                        </div>
                    )}
                    {blockError && (
                        <div className="mt-3 alert alert-danger" role="alert">
                            We are very sorry, you are blocked :(
                        </div>
                    )}
                </div>
            </div>
            {isLoggedIn && !blockError && userExists && (<Table/>)}
        </div>
    );
};

export default Login;
