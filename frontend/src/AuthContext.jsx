import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verificar si hay una sesión activa al cargar la página
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            // Intentamos obtener los contactos para verificar si hay sesión activa
            const response = await fetch('http://127.0.0.1:5000/contacts', {
                credentials: 'include',
                method: 'GET',
            });
            
            if (response.ok) {
                // Si podemos obtener contactos, significa que hay una sesión activa
                // Necesitaremos obtener info del usuario de alguna manera
                setUser({ authenticated: true });
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            
            if (data.success) {
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    };

    const signup = async (email, password1, password2, firstName) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/auth/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password1,
                    password2,
                    first_name: firstName,
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    };

    const logout = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setUser(null);
                return { success: true };
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
        
        // Limpiar usuario localmente incluso si falla la petición
        setUser(null);
        return { success: true };
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
