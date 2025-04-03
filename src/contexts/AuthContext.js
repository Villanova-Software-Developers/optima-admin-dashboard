import React, { createContext, useContext, useEffect, useState } from 'react';
import { getProfile, login, register } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // check if user already logged in on component mount
    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('adminToken');
            if (token) {
                try {
                    const storedAdmin = JSON.parse(localStorage.getItem('adminUser'));
                    if (storedAdmin) {
                        setCurrentAdmin(storedAdmin);
                    } else {
                        //fetch admin profile if token exists but no admin data
                        const adminData = await getProfile();
                        setCurrentAdmin(adminData.admin);
                        localStorage.setItem('adminUser', JSON.stringify(adminData.admin));
                    }
                } catch (err) {
                    console.error('Error getting admin profile:', err);
                    // clear invalid data
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    //login func
    const loginAdmin = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await login(email, password);
            if (response.success) {
                localStorage.setItem('adminToken', response.token);
                localStorage.setItem('adminUser', JSON.stringify(response.admin));
                setCurrentAdmin(response.admin);
            }
            setLoading(false);
            return response;
        } catch (err) {
            setError(err.response?.data?.error || 'Login Failed. Please try again');
            setLoading(false);
            throw err;
        }
    };

    //register func
    const registerAdmin = async (email, password, name, registrationKey) => {
        setLoading(true);
        setError(null);
        try {
            const response = await register(email, password, name, registrationKey);
            setLoading(false)
            return response;
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. PLease try again.');
            setLoading(false);
            throw err;
        }
    };

    //logout func
    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setCurrentAdmin(null);
    };

    const value = {
        currentAdmin,
        loading,
        error,
        loginAdmin,
        registerAdmin,
        logout,
        isAuthenticated: !!currentAdmin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;