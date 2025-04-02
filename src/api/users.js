import api from "./index";

// get all users with pagination
export const getUsers = async (limit = 50, startAfter = null) => {
    try {
        const params = { limit };
        if (startAfter) {
            params.startAfter = startAfter;
        }
        const response = await api.get('/admin/users', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserDetails = async (userId) => {
    try {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const suspendUser = async (userId, suspended = true) => {
    try {
        const response = await api.post(`/admin/users/${userId}/suspend`, { suspended });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};