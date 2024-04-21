import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { formatDate } from "../../components/helpers/helpers";
import {Button} from "react-bootstrap";

const Register = () => {
    const [isRegistered, setIsRegistered] = useState(false);
    const [isUserExists, setIsUserExists] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        shouldUnregister: true,
    });

    const onSubmit = async (data) => {
        try {
            const isUserExist = await axios.get(
                process.env.REACT_APP_API_URL +
                `/app-users?filters[userEmail][$eq]=${data.email}`
            );
            const isExist = isUserExist.data.data[0];
            if (!isExist) {
                setIsUserExists(false);
                const registrationDate = formatDate(new Date());
                const currentDateTime = formatDate(new Date(), true);
                const response = await axios.post(
                    process.env.REACT_APP_API_URL + '/app-users',
                    {
                        data: {
                            userName: data.name,
                            userEmail: data.email,
                            userPassword: data.password,
                            registrationDate: registrationDate,
                            lastLoginDate: currentDateTime,
                            status: 'active',
                            blocked: false,
                        },
                    }
                );
                console.log('Response:', response.data);
            } else {
                setIsUserExists(true);
            }
            reset();
            setIsRegistered(true);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    if (isUserExists) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                <h1 className="text-center fs-2">
                    The user with this email already exists!
                </h1>
                <Button variant="outline-info" className="mx-3 w-25 mt-5">
                    <NavLink
                        to="/login"
                        className="text-decoration-none text-light"
                    >
                        Login
                    </NavLink>
                </Button>
            </div>
        );
    }

    if (isRegistered) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                <p className="mb-5 text-center fs-5">
                    Congratulations! <br/> You have successfully registered! Now you can
                    visit our website after logging in.
                </p>
                <button className="btn btn-outline-info mx-3 w-25">
                    <NavLink
                        to="/login"
                        className="text-white"
                        style={{ textDecoration: 'none', color: 'white' }}
                    >
                        Login
                    </NavLink>
                </button>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group mb-3">
                    <label htmlFor="name" className="mb-1 text-light">
                        Name:
                    </label>
                    <input
                        type="text"
                        className={`form-control`}
                        placeholder="Enter your name"
                        {...register('name', {
                            required: 'Please enter your name',
                        })}
                    />
                    {errors.name && (
                        <span className="invalid-feedback">{errors.name}</span>
                    )}
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="email" className="mb-1 text-light">
                        Email:
                    </label>
                    <input
                        type="email"
                        className={`form-control`}
                        placeholder="Enter your email"
                        {...register('email', {
                            required: 'Please enter your email',
                            placeholder: 'Enter your email',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Please enter a valid email address',
                            },
                        })}
                    />
                    {errors.email && (
                        <span className="invalid-feedback">{errors.email.message}</span>
                    )}
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="password" className="mb-1 text-light">
                        Enter your password:
                    </label>
                    <input
                        type="password"
                        className={`form-control`}
                        placeholder="Enter your password"
                        {...register('password', {
                            required: 'Please enter your password',
                        })}
                    />
                </div>
                <div className="d-grid">
                    <button type="submit" className="btn btn-outline-secondary">
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;

