// src/components/community/TaskForm.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper
} from '@mui/material';
import { createCommunityTask } from '../../api/community';
import AlertMessage from '../common/AlertMessage';

const TaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    reward_minutes: '',
    deadlineDate: '',
    deadlineTime: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.reward_minutes) {
      newErrors.reward_minutes = 'Reward time is required';
    } else if (isNaN(formData.reward_minutes) || parseInt(formData.reward_minutes) <= 0) {
      newErrors.reward_minutes = 'Reward time must be a positive number';
    }
    
    if (!formData.deadlineDate) {
      newErrors.deadlineDate = 'Deadline date is required';
    }
    
    if (!formData.deadlineTime) {
      newErrors.deadlineTime = 'Deadline time is required';
    }
    
    // Check if deadline is in the future
    if (formData.deadlineDate && formData.deadlineTime) {
      const deadlineString = `${formData.deadlineDate}T${formData.deadlineTime}`;
      const deadlineDate = new Date(deadlineString);
      const now = new Date();
      
      if (deadlineDate <= now) {
        newErrors.deadlineDate = 'Deadline must be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Format the date for the API (DD/MM/YYYY HH:MM)
      const deadlineDate = new Date(`${formData.deadlineDate}T${formData.deadlineTime}`);
      const formattedDeadline = formatDateForAPI(deadlineDate);
      
      const taskData = {
        title: formData.title,
        category: formData.category,
        reward_minutes: parseInt(formData.reward_minutes),
        deadline: formattedDeadline
      };
      
      const response = await createCommunityTask(taskData);
      
      setAlert({
        open: true,
        message: 'Community task created successfully!',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        reward_minutes: '',
        deadlineDate: '',
        deadlineTime: ''
      });
      
      // Notify parent component
      if (onTaskCreated) {
        onTaskCreated(response.community_task);
      }
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to create task: ${error.response?.data?.error || error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Format date as DD/MM/YYYY HH:MM for API
  const formatDateForAPI = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Create New Community Task
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Tasks will be visible to all users and offer screen time rewards upon completion.
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          margin="normal"
          id="title"
          name="title"
          label="Task Title"
          value={formData.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          disabled={loading}
          required
        />
        
        <TextField
          fullWidth
          margin="normal"
          id="category"
          name="category"
          label="Category"
          value={formData.category}
          onChange={handleChange}
          error={!!errors.category}
          helperText={errors.category}
          disabled={loading}
          required
          placeholder="e.g. Physical Activity, Learning, Social, etc."
        />
        
        <TextField
          fullWidth
          margin="normal"
          id="reward_minutes"
          name="reward_minutes"
          label="Reward (minutes)"
          type="number"
          value={formData.reward_minutes}
          onChange={handleChange}
          error={!!errors.reward_minutes}
          helperText={errors.reward_minutes}
          disabled={loading}
          required
          inputProps={{ min: 1 }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            id="deadlineDate"
            name="deadlineDate"
            label="Deadline Date"
            type="date"
            value={formData.deadlineDate}
            onChange={handleChange}
            error={!!errors.deadlineDate}
            helperText={errors.deadlineDate}
            disabled={loading}
            required
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: getTodayDateString() }}
          />
          
          <TextField
            fullWidth
            id="deadlineTime"
            name="deadlineTime"
            label="Deadline Time"
            type="time"
            value={formData.deadlineTime}
            onChange={handleChange}
            error={!!errors.deadlineTime}
            helperText={errors.deadlineTime}
            disabled={loading}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? 'Creating Task...' : 'Create Community Task'}
        </Button>
      </Box>
      
      <AlertMessage
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={handleCloseAlert}
      />
    </Paper>
  );
};

export default TaskForm;