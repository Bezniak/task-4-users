import React from 'react';
import {useForm} from 'react-hook-form';

const RegistrationForm = ({onSubmit}) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        trigger,
    } = useForm({
        shouldUnregister: true,
    });

    const handleBlur = async (fieldName) => {
        try {
            await trigger(fieldName);
        } catch (error) {
            console.error('Error occurred while triggering validation:', error);
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-25">
            <div className="form-group mb-3">
                <label htmlFor="name" className="form-label text-light">
                    Name:
                </label>
                <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Enter your name"
                    {...register('name', {
                        required: 'Please enter your name',
                    })}
                    onBlur={() => handleBlur('name')}
                />
                {errors.name && <span className="invalid-feedback">{errors.name.message}</span>}
            </div>
            <div className="form-group mb-3">
                <label htmlFor="email" className="form-label text-light">
                    Email:
                </label>
                <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter your email"
                    {...register('email', {
                        required: 'Please enter your email',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address',
                        },
                    })}
                    onBlur={() => handleBlur('email')}
                />
                {errors.email && <span className="invalid-feedback">{errors.email.message}</span>}
            </div>
            <div className="form-group mb-3">
                <label htmlFor="password" className="form-label text-light">
                    Password:
                </label>
                <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Enter your password"
                    {...register('password', {
                        required: 'Please enter your password',
                    })}
                    onBlur={() => handleBlur('password')}
                />
                {errors.password && <span className="invalid-feedback">{errors.password.message}</span>}
            </div>
            <div className="d-grid">
                <button type="submit" className="btn btn-outline-secondary">
                    Register
                </button>
            </div>
        </form>
    );
};

export default RegistrationForm;
