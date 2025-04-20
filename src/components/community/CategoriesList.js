import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateTaskCategory, deleteTaskCategory } from '../../api/community';
import AlertMessage from '../common/AlertMessage';
import { formatDate } from '../../utils/format';

const CATEGORY_TYPES = [
  'Physical Activity',
  'Learning',
  'Creative',
  'Social',
  'Mindfulness',
  'Volunteering',
  'Other'
];

const CategoriesList = ({ categories = [], onCategoryAction }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    category_name: '',
    category_type: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  // Open edit dialog
  const handleEditOpen = (category) => {
    setSelectedCategory(category);
    setEditForm({
      category_name: category.category_name || '',
      category_type: category.category_type || '',
      description: category.description || ''
    });
    setEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteOpen = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  // Close dialogs
  const handleCloseDialogs = () => {
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
    setEditForm({
      category_name: '',
      category_type: '',
      description: ''
    });
    setErrors({});
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
    
    // Clear error
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!editForm.category_name.trim()) {
      newErrors.category_name = 'Category name is required';
    }
    
    if (!editForm.category_type) {
      newErrors.category_type = 'Category type is required';
    }
    
    if (!editForm.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save edited category
  const handleSaveCategory = async () => {
    if (!selectedCategory || !validateForm()) return;
    
    setLoading(true);
    try {
      const response = await updateTaskCategory(selectedCategory.id, editForm);
      
      setAlert({
        open: true,
        message: 'Category updated successfully',
        severity: 'success'
      });
      
      // Notify parent component
      if (onCategoryAction) {
        onCategoryAction({
          type: 'UPDATE',
          categoryId: selectedCategory.id,
          data: response.category
        });
      }
      
      handleCloseDialogs();
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to update category: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    setLoading(true);
    try {
      await deleteTaskCategory(selectedCategory.id);
      
      setAlert({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success'
      });
      
      // Notify parent component
      if (onCategoryAction) {
        onCategoryAction({
          type: 'DELETE',
          categoryId: selectedCategory.id
        });
      }
      
      handleCloseDialogs();
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to delete category: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Close alert
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.category_name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={category.category_type || 'Unknown'} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{formatDate(category.created_at)}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ '& > button': { ml: 1 } }}>
                      <Tooltip title="Edit category">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleEditOpen(category)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete category">
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDeleteOpen(category)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No categories found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Category Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseDialogs}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            id="category_name"
            name="category_name"
            label="Category Name"
            value={editForm.category_name}
            onChange={handleFormChange}
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
            <InputLabel id="edit-category-type-label">Category Type</InputLabel>
            <Select
              labelId="edit-category-type-label"
              id="category_type"
              name="category_type"
              value={editForm.category_type}
              onChange={handleFormChange}
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
            value={editForm.description}
            onChange={handleFormChange}
            error={!!errors.description}
            helperText={errors.description}
            disabled={loading}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveCategory}
            color="primary"
            disabled={loading}
            autoFocus
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialogs}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{selectedCategory?.category_name}"? This action cannot be undone.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, color: 'warning.main' }}>
            Warning: Deleting this category may affect tasks that use it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteCategory}
            color="error"
            disabled={loading}
            autoFocus
          >
            {loading ? 'Deleting...' : 'Delete Category'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Message */}
      <AlertMessage 
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={handleCloseAlert}
      />
    </>
  );
};

export default CategoriesList;