import api from './index';

export const getAdminLogs = async (limit = 100) => {
    try {
        const response = await api.get('/admin/logs', { params: { limit }});
        return response.data;
    } catch (error) {
        throw error;
    }
};