import api from './index';

export const createCommunityTask = async (taskData) => {
    try {
        const response = await api.post('/admin/community/tasks', taskData);
        return response.data;
    } catch (error) {
        throw error;
    }
};