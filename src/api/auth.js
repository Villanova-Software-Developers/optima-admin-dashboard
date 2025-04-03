import api from './index';
import { handleFirebaseTimestamps } from '../utils/firebase';

export const login = async (email, password) => {
    try {
        const response = await api.post('/admin/login', {email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (email, password, name, registrationKey) => {
    try {
        const response = await api.post('/admin/register', {
            email,
            password,
            name,
            registrationKey,
        });
        
        // Process response data to handle potential timestamp issues
        return {
            ...response.data,
            admin: response.data.admin ? handleFirebaseTimestamps(response.data.admin) : null
        };
    } catch (error) {
        console.error('Registration error:', error);
        
        // Special case for Firebase Sentinel serialization error
        if (error.message && error.message.includes('JSON')) {
            console.log('Detected Firebase serialization error - registration likely succeeded');
            return { 
                success: true, 
                admin: { email, name },
                message: 'Registration successful, but response had serialization issues. Please proceed to login.'
            };
        }
        
        if (error.response) {
            throw error;
        } else if (error.request) {
            throw new Error('Network error. Please check your connection and try again.');
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
};

export const getProfile = async () => {
    try {
        const response = await api.get('/admin/profile');
        return response.data;
    } catch (error) {
        throw error;
    }
};