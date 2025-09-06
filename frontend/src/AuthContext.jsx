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
            setLoading(false);
        };
    };
}