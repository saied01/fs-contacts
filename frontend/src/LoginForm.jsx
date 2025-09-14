import { useState } from 'react';
import { useAuth } from './AuthContext';

const LoginForm = ({ onSwitchToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        const result = await login(email, password);
        
        if (!result.success) {
            setError(result.message);
        }
        
        setLoading(false);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card bg-dark text-light" style={{ width: '400px' }}>
                <div className="card-header text-center">
                    <h3>Login</h3>
                </div>
                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control bg-dark text-light border-secondary"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control bg-dark text-light border-secondary"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        
                        <div className="d-grid">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="text-center mt-3">
                        <span>Don't have an account? </span>
                        <button
                            type="button"
                            className="btn btn-link text-info p-0 text-decoration-underline"
                            onClick={onSwitchToSignup}
                            disabled={loading}
                            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                            Sign up here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
