import api from './index';

export const getSummaryAnalysis = async (days = 30) => {
    try {
        const response = await api.get('/admin/analytics/summary', { params: { days }});
        return response.data;
    } catch (error) {
        throw error;
    }
};