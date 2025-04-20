import { resolveDateFormat } from '@mui/x-date-pickers/internals/utils/date-utils';
import api from './index';

export const getCommunityTasks = async (limit = 50, startAfter = null) => {
    try {
        const params = { limit };
        if (startAfter) {
            params.startAfter = startAfter;
        }
        const response = await api.get('/admin/community-tasks', {params});
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCommunityTaskDetails = async (taskId) => {
    try {
        const response = await api.get(`/admin/community-tasks/${taskId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createCommunityTask = async (taskData) => {
    try {
        const response = await api.post(`/admin/community-tasks`, taskData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCommunityTask = async (taskId, updates) => {
    try {
        const response = await api.put(`/admin/community-tasks/${taskId}`, updates);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCommunityTask = async (taskId) => {
    try {
        const response = await api.delete(`/admin/community-tasks/${taskId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCommunityTaskStats = async () => {
    try {
        const response = await api.get('/admin/community-tasks/stats');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTaskCategories = async () => {
    try {
        const response = await api.get('/admin/community-tasks/categories');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTaskCategoryDetails = async (categoryId) => {
    try {
        const response = await api.get(`/admin/community-tasks/categories/${categoryId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createTaskCategory = async (categoryData) => {
    try {
        const response = await api.post('/admin/community-tasks/categories', categoryData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTaskCategory = async (categoryId, updates) => {
    try {
        const response = await api.put(`/admin/community-tasks/categories/${categoryId}`, updates);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTaskCategory = async (categoryId) => {
    try {
        const response = await api.delete(`/admin/community-tasks/categories/${categoryId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};