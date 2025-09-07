import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new error('context must be used within AuthProvider.'); // using useAuth outside provider throws error
    }

    return context;
}


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // current user
    const [loading, setLoading] = useState(true);

    useEffect = (() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            // tries accesing protected route
            const response = await fetch('http://127.0.0.1:5000/api/contacts/contacts', {
                credentials:'include', // sends session cookies
            });
            if (response.ok) {
                // if it works = user already logged in
                setUser({ loggedIn: true });
            }
        } catch(error) {
            console.log('not authenticated user found.');
        } finally {
            setLoading(false); // when verification ends
        };
    };


    const login = async (email, password) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/auth/login', {
                credentials:'include',
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch(error) {
            return { success: false, message: 'Error connecting to server.' };
        }
    };


    const logout = async () => {
        try {
            await fetch('http://127.0.0.1:5000/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch(error) {
            console.log('logout error.', error);
        } finally {
            setUser(null);
        }
    };


    const signup = async (email, first_name, password1, password2) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/auth/sign-up', {
                credentials: 'include',
                method: 'POST',
                headers: {
              'Content-Type': 'application/json'},
                body: JSON.stringify({ email, first_name, password1, password2 }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch(error) {
            return { success: true, message: 'Error connecting to server.' };
        };
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}> { children } </AuthContext.Provider>;
};