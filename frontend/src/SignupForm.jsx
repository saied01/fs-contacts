import { useState } from 'react';
import { useAuth } from './AuthContext';

const SignupForm = ({ onSwitchToLogin, onSignupSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        password1: '',
        password2: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validaciones básicas
        if (!formData.firstName || !formData.email || !formData.password1 || !formData.password2) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (formData.password1 !== formData.password2) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const result = await signup(
            formData.email,
            formData.password1,
            formData.password2,
            formData.firstName
        );
        
        if (result.success) {
            onSignupSuccess();
        } else {
            setError(result.message);
        }
        
        setLoading(false);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card bg-dark text-light" style={{ width: '400px' }}>
                <div className="card-header text-center">
                    <h3>Sign Up</h3>
                </div>
                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">
                                First Name
                            </label>
                            <input
                                type="text"
                                className="form-control bg-dark text-light border-secondary"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control bg-dark text-light border-secondary"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="password1" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control bg-dark text-light border-secondary"
                                id="password1"
                                name="password1"
                                value={formData.password1}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="password2" className="form-label">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="form-control bg-dark text-light border-secondary"
                                id="password2"
                                name="password2"
                                value={formData.password2}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>
                        
                        <div className="d-grid">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="text-center mt-3">
                        <span>Already have an account? </span>
                        <button
                            type="button"
                            className="btn btn-link text-info p-0 text-decoration-underline"
                            onClick={onSwitchToLogin}
                            disabled={loading}
                            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                            Sign in here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
