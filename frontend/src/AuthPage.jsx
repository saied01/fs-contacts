import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthPage = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const switchToSignup = () => {
        setIsLoginMode(false);
        setShowSuccessMessage(false);
    };

    const switchToLogin = () => {
        setIsLoginMode(true);
        setShowSuccessMessage(false);
    };

    const handleSignupSuccess = () => {
        setShowSuccessMessage(true);
        setIsLoginMode(true);
    };

    return (
        <div className="bg-dark min-vh-100">
            {showSuccessMessage && (
                <div className="container pt-3">
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        Account created successfully! Please sign in with your credentials.
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowSuccessMessage(false)}
                        ></button>
                    </div>
                </div>
            )}
            
            {isLoginMode ? (
                <LoginForm onSwitchToSignup={switchToSignup} />
            ) : (
                <SignupForm 
                    onSwitchToLogin={switchToLogin} 
                    onSignupSuccess={handleSignupSuccess}
                />
            )}
        </div>
    );
};

export default AuthPage;
