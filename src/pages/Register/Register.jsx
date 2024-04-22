import React, {useState} from 'react';
import axios from 'axios';
import {formatDate} from '../../components/helpers/helpers';
import RegistrationForm from './RegistrationForm';
import ErrorMessage from "./ErrorMessage";
import {NavLink} from "react-router-dom";
import bcrypt from 'bcryptjs';


const Register = () => {
    const [message, setMessage] = useState('');

    const onSubmit = async (data) => {
        try {
            const registrationDate = formatDate(new Date());
            const currentDateTime = formatDate(new Date(), true);
            const hashedPassword = await bcrypt.hash(data.password, 10);
            await axios.post(process.env.REACT_APP_API_URL + '/app-users', {
                data: {
                    userName: data.name,
                    userEmail: data.email,
                    userPassword: hashedPassword,
                    registrationDate: registrationDate,
                    lastLoginDate: currentDateTime,
                    status: 'active',
                    blocked: false,
                },
            });
            setMessage(`Congratulations! You have successfully registered! 
                Now you can visit our website after logging in.`);
        } catch (error) {
            console.error('Registration failed:', error);
            if (error?.response?.status === 400) {
                const responseData = error?.response?.data;
                if (responseData?.error?.message === 'This attribute must be unique') {
                    setMessage('The user with this email already exists!');
                }
            }
        }
    };


    return (
        <div className="container mt-4">
            <NavLink to="/" className="btn btn-outline-warning mb-3">
                Home
            </NavLink>
            <div className="d-flex justify-content-center align-items-center vh-100">
                {message && (
                    <ErrorMessage message={message}/>
                )}
                {!message && (
                    <RegistrationForm onSubmit={onSubmit}/>
                )}
            </div>
        </div>
    );
};

export default Register;
