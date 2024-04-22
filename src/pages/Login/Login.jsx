import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import {NavLink} from 'react-router-dom';
import bcrypt from 'bcryptjs'; // Импортируйте bcryptjs
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from '../../components/Table/Table';
import Header from '../../components/Header/Header';

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        trigger,
    } = useForm({shouldUnregister: true});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userExists, setUserExists] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        const userData = localStorage.getItem('userExists');
        if (loggedInStatus === 'true' && userData) {
            setIsLoggedIn(true);
            setUserExists(JSON.parse(userData));
        }
    }, []);

    const handleLogin = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/app-users?filters[userEmail][$eq]=${data.userEmail}`
            );
            const userData = response.data.data[0];
            if (userData) {
                const hashedPasswordFromServer = userData.attributes.userPassword;
                const isPasswordMatch = await bcrypt.compare(data.userPassword, hashedPasswordFromServer);
                if (isPasswordMatch) {
                    if (userData.attributes.status === 'blocked') {
                        setError('blocked');
                    } else {
                        setUserExists(userData);
                        setIsLoggedIn(true);
                        setError('');
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('userExists', JSON.stringify(userData));
                    }
                } else {
                    setError('login');
                }
            } else {
                setError('login');
            }
        } catch (error) {
            console.error(error);
            setError('login');
        }
        setIsLoading(false);
        reset();
    };

    const handleBlur = async (fieldName) => {
        try {
            await trigger(fieldName);
        } catch (error) {
            console.error('Error occurred while triggering validation:', error);
        }
    };


    return (
        <div className="container mt-4">
            {isLoggedIn && userExists && (
                <Header userName={userExists?.attributes?.userName} setUserExists={setUserExists}
                        setIsLoggedIn={setIsLoggedIn}/>
            )}
            <NavLink to="/" className="btn btn-outline-warning mb-3">
                Home
            </NavLink>
            <div
                className="container d-flex justify-content-center align-items-center position-absolute top-50 left-50">
                <div className="w-25">
                    {!isLoggedIn && (
                        <form onSubmit={handleSubmit(handleLogin)}>
                            <div className="form-group mb-3">
                                <label htmlFor="userEmail" className="mb-1 text-light">
                                    Login:
                                </label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.userEmail ? 'is-invalid' : ''}`}
                                    placeholder="Email"
                                    {...register('userEmail', {
                                        required: 'Please enter your email',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Please enter a valid email address',
                                        },
                                    })}
                                    onBlur={() => handleBlur('userEmail')}
                                />
                                {errors.userEmail &&
                                    <span className="invalid-feedback">{errors.userEmail.message}</span>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="userPassword" className="mb-1 text-light">
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.userPassword ? 'is-invalid' : ''}`}
                                    placeholder="Password"
                                    {...register('userPassword', {
                                        required: 'Please enter your password',
                                    })}
                                    onBlur={() => handleBlur('userPassword')}
                                />
                                {errors.userPassword && (
                                    <span className="invalid-feedback">{errors.userPassword.message}</span>
                                )}
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-outline-secondary" disabled={isLoading}>
                                    {isLoading ? 'Loading...' : 'Login'}
                                </button>
                            </div>
                        </form>
                    )}
                    {error === 'login' && !isLoggedIn && (
                        <div className="mt-3 alert alert-danger" role="alert">
                            Invalid email or password. Please try again.
                        </div>
                    )}
                    {error === 'blocked' && (
                        <div className="mt-3 alert alert-danger" role="alert">
                            We are very sorry, you are blocked :(
                        </div>
                    )}
                </div>
            </div>
            {isLoggedIn && !error && userExists && <Table/>}
        </div>
    );
};

export default Login;
