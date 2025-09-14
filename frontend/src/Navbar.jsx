import { useAuth } from './AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
            <div className="container">
                <a className="navbar-brand" href="#">
                    <strong>My Contacts App</strong>
                </a>
                
                <div className="navbar-nav ms-auto">
                    {user && (
                        <div className="d-flex align-items-center">
                            {user.firstName && (
                                <span className="navbar-text me-3">
                                    Welcome, {user.firstName}!
                                </span>
                            )}
                            <button
                                className="btn btn-outline-light btn-sm"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
