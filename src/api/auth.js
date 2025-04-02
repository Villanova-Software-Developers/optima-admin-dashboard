import api from './index';

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
        return response.data;
    } catch (error) {
        throw error;
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