import React, { useState } from "react";
import { useAuth } from './AuthContext';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true); // login mode (signup mode if false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password2: '',
        first_name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, signup } = useAuth(); // it was created in AuthContext

    const handleInputChange = (e) => {
        setFormData({
            ...formData,                  // keeps previous values
            [e.target.name]: e.target.value, // changes edited field
        });

        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents site from reloading
        setLoading(true);
        setError('');

        try {
            let result;

            if (isLogin) {
                // login mode
                result = await login(formData.email, formData.password);
            } else {
                // signup mode
                result = await signup(
                    formData.email,
                    formData.password,
                    formData.password2,
                    formData.first_name
                );

                // if signup was successful -> login
                if (result.success) {
                    setIsLogin(true);
                    setFormData({ email: formData.email, password: '', password2: '', first_name: '' })
                }
            };

            if (!result.success) {
                setError(result.message);
            }
        } catch(error) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        // clean form data
        setFormData({ email: '', password: '', password2: '', first_name: '' });
        setError('');
    };


    return(
        <div className="container mt-4 bg-dark text-light">
            <div className="form-group">
                <h2>{ isLogin ? 'Login' : 'Sign Up' }</h2>

                {error && <div className="alert alert-danger" role="alert">{error}</div>}

                <form onSubmit={handleSubmit}></form>
            </div>
        </div>
    )
};