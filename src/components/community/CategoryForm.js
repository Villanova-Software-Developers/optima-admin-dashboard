import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { createTaskCategory } from '../../api/community';
import AlertMessage from '../common/AlertMessage';

const CATEGORY_TYPES = [
  'Physical Activity',
  'Learning',
  'Creative',
  'Social',
  'Mindfulness',
  'Volunteering',
  'Other'
];

const CategoryForm = ({ onCategoryCreated }) => {
  const [formData, setFormData] = useState({
    category_name: '',
    category_type: '',
    description: ''
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
    
    if (!formData.category_name.trim()) {
      newErrors.category_name = 'Category name is required';
    }
    
    if (!formData.category_type) {
      newErrors.category_type = 'Category type is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
      const response = await createTaskCategory(formData);
      
      setAlert({
        open: true,
        message: 'Category created successfully!',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        category_name: '',
        category_type: '',
        description: ''
      });
      
      // Notify parent component
      if (onCategoryCreated) {
        onCategoryCreated(response.category);
      }
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to create category: ${error.response?.data?.error || error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Create New Category
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Categories help organize community tasks and make them easier to find for users.
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          margin="normal"
          id="category_name"
          name="category_name"
          label="Category Name"
          value={formData.category_name}
          onChange={handleChange}
          error={!!errors.category_name}
          helperText={errors.category_name}
          disabled={loading}
          required
        />
        
        <FormControl 
          fullWidth 
          margin="normal" 
          error={!!errors.category_type}
          required
        >
          <InputLabel id="category-type-label">Category Type</InputLabel>
          <Select
            labelId="category-type-label"
            id="category_type"
            name="category_type"
            value={formData.category_type}
            onChange={handleChange}
            label="Category Type"
            disabled={loading}
          >
            <MenuItem value="" disabled>
              Select a type
            </MenuItem>
            {CATEGORY_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          {errors.category_type && (
            <Typography variant="caption" color="error">
              {errors.category_type}
            </Typography>
          )}
        </FormControl>
        
        <TextField
          fullWidth
          margin="normal"
          id="description"
          name="description"
          label="Description"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          disabled={loading}
          required
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? 'Creating Category...' : 'Create Category'}
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

export default CategoryForm;