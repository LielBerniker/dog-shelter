// src/contexts/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);

    const loginAsAdmin = () => {
        setIsAdmin(true);
    };

    const logout = () => {
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isAdmin, loginAsAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
