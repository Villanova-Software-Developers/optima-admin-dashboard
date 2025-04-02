import api from './index';

export const getPosts = async (limit = 50, startAfter = null) => {
    try {
        const params = { limit };
        if (startAfter) {
            params.startAfter = startAfter;
        }
        const response = await api.get('/admin/posts', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPostDetails = async (postId) => {
    try {
        const response = await api.get(`/admin/posts/${postId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deletePost = async (postId) => {
    try {
        const response = await api.delete(`/admin/posts/${postId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePostContent = async (postId, content) => {
    try {
        const response = await api.put(`/admin/posts/${postId}/content`, { content });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteComment = async (postId, commentId) => {
    try {
        const response = await api.delete(`/admin/posts/${postId}/comments/${commentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};