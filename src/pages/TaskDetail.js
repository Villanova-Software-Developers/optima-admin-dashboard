import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import { 
  getCommunityTaskDetails, 
  updateCommunityTask, 
  deleteCommunityTask,
  getTaskCategories
} from '../api/community';
import Layout from '../components/common/Layout';
import AlertMessage from '../components/common/AlertMessage';
import { formatDate } from '../utils/format';

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  
  // Edit and delete dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    category: '',
    reward_minutes: '',
    deadlineDate: '',
    deadlineTime: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [dialogLoading, setDialogLoading] = useState(false);

  // Fetch task details and categories
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        const response = await getCommunityTaskDetails(taskId);
        if (response.success) {
          setTask(response.task);
          
          // Initialize edit form with task data
          if (response.task) {
            const task = response.task;
            const deadline = task.deadline ? new Date(task.deadline) : new Date();
            
            setEditForm({
              title: task.title || '',
              category: task.category || '',
              reward_minutes: task.reward_minutes || '',
              deadlineDate: formatDateForInput(deadline),
              deadlineTime: formatTimeForInput(deadline)
            });
          }
        } else {
          setError('Failed to load task details');
        }
      } catch (err) {
        console.error('Error fetching task details:', err);
        setError('Failed to load task details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await getTaskCategories();
        if (response.success) {
          setCategories(response.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (taskId) {
      fetchTaskDetails();
      fetchCategories();
    }
  }, [taskId]);

  // Format date as YYYY-MM-DD for input field
  const formatDateForInput = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Format time as HH:MM for input field
  const formatTimeForInput = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
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

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
    
    // Clear error
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!editForm.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!editForm.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!editForm.reward_minutes) {
      newErrors.reward_minutes = 'Reward minutes is required';
    } else if (isNaN(editForm.reward_minutes) || parseInt(editForm.reward_minutes) <= 0) {
      newErrors.reward_minutes = 'Reward minutes must be a positive number';
    }
    
    if (!editForm.deadlineDate) {
      newErrors.deadlineDate = 'Deadline date is required';
    }
    
    if (!editForm.deadlineTime) {
      newErrors.deadlineTime = 'Deadline time is required';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Go back to tasks list
  const handleGoBack = () => {
    navigate('/community-tasks');
  };

  // Open edit dialog
  const handleEditDialogOpen = () => {
    setEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  // Close dialogs
  const handleCloseDialogs = () => {
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
  };

  // Update task
  const handleUpdateTask = async () => {
    if (!task || !validateForm()) return;
    
    setDialogLoading(true);
    try {
      // Format deadline
      const deadlineDate = new Date(`${editForm.deadlineDate}T${editForm.deadlineTime}`);
      const formattedDeadline = formatDateForAPI(deadlineDate);
      
      const updateData = {
        title: editForm.title,
        category: editForm.category,
        reward_minutes: parseInt(editForm.reward_minutes),
        deadline: formattedDeadline
      };
      
      const response = await updateCommunityTask(task.id, updateData);
      
      setAlert({
        open: true,
        message: 'Task updated successfully',
        severity: 'success'
      });
      
      // Update local state
      setTask(response.task);
      
      handleCloseDialogs();
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to update task: ${error.response?.data?.error || error.message}`,
        severity: 'error'
      });
    } finally {
      setDialogLoading(false);
    }
  };

  // Delete task
  const handleDeleteTask = async () => {
    if (!task) return;
    
    setDialogLoading(true);
    try {
      await deleteCommunityTask(task.id);
      
      setAlert({
        open: true,
        message: 'Task deleted successfully',
        severity: 'success'
      });
      
      // Navigate back to tasks list after a short delay
      setTimeout(() => {
        navigate('/community-tasks');
      }, 1500);
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to delete task: ${error.response?.data?.error || error.message}`,
        severity: 'error'
      });
    } finally {
      setDialogLoading(false);
      handleCloseDialogs();
    }
  };

  // Close alert
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Check if task is expired
  const isTaskExpired = (deadline) => {
    if (!deadline) return false;
    
    const now = new Date();
    const taskDeadline = new Date(deadline);
    return taskDeadline <= now;
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ pt: 2, pb: 4, display: 'flex', alignItems: 'center' }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleGoBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="div">
            Task Details
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : task ? (
          <Grid container spacing={3}>
            {/* Task details card */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h5">{task.title}</Typography>
                  <Box>
                    <Button 
                      startIcon={<EditIcon />} 
                      variant="outlined" 
                      size="small"
                      onClick={handleEditDialogOpen}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      startIcon={<DeleteIcon />} 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      onClick={handleDeleteDialogOpen}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                  <Chip 
                    label={task.category} 
                    color="primary" 
                    variant="outlined" 
                    size="small" 
                  />
                  <Chip 
                    icon={<TimerIcon />} 
                    label={`${task.reward_minutes} minutes reward`} 
                    color="success" 
                    variant="outlined" 
                    size="small" 
                  />
                  <Chip 
                    icon={isTaskExpired(task.deadline) ? <DeleteIcon /> : <CheckCircleIcon />} 
                    label={isTaskExpired(task.deadline) ? 'Expired' : 'Active'} 
                    color={isTaskExpired(task.deadline) ? 'error' : 'success'} 
                    size="small" 
                  />
                </Box>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Deadline:</strong> {formatDate(task.deadline)}
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Created:</strong> {formatDate(task.created_at)}
                </Typography>
                
                {task.updated_at && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Last Updated:</strong> {formatDate(task.updated_at)}
                  </Typography>
                )}
              </Paper>
            </Grid>
            
            {/* Participants cards */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader 
                  title="Participation" 
                  subheader={`${task.participants?.length || 0} users joined`}
                />
                <Divider />
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      icon={<PersonIcon />} 
                      label={`${task.participants?.length || 0} participants`} 
                      color="primary" 
                      sx={{ mr: 1 }} 
                    />
                    <Chip 
                      icon={<CheckCircleIcon />} 
                      label={`${task.completed_by?.length || 0} completed`} 
                      color="success" 
                    />
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Completion Rate
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    {task.participants?.length > 0 
                      ? `${Math.round((task.completed_by?.length || 0) / task.participants.length * 100)}%` 
                      : '0%'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Participants list */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Participants" />
                <Divider />
                <CardContent sx={{ p: 0 }}>
                  {task.participants?.length > 0 ? (
                    <List>
                      {task.participants.map((participant, index) => (
                        <React.Fragment key={participant.id}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar>
                                <PersonIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={participant.username}
                              secondary={participant.email}
                            />
                          </ListItem>
                          {index < task.participants.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" sx={{ p: 2 }}>
                      No participants yet
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            {/* Completed by list */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Completed By" />
                <Divider />
                <CardContent sx={{ p: 0 }}>
                  {task.completed_by?.length > 0 ? (
                    <List>
                      {task.completed_by.map((user, index) => (
                        <React.Fragment key={user.id}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'success.main' }}>
                                <CheckCircleIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={user.username}
                              secondary={user.email}
                            />
                          </ListItem>
                          {index < task.completed_by.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" sx={{ p: 2 }}>
                      No completions yet
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" align="center">
              Task not found
            </Typography>
          </Paper>
        )}
      </Container>
      
      {/* Edit Task Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseDialogs}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            id="title"
            name="title"
            label="Task Title"
            value={editForm.title}
            onChange={handleFormChange}
            error={!!formErrors.title}
            helperText={formErrors.title}
            disabled={dialogLoading}
            required
          />
          
          <FormControl 
            fullWidth 
            margin="normal" 
            error={!!formErrors.category}
            required
          >
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={editForm.category}
              onChange={handleFormChange}
              label="Category"
              disabled={dialogLoading || categoriesLoading}
            >
              {categoriesLoading ? (
                <MenuItem value="">
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading categories...
                </MenuItem>
              ) : (
                <>
                  <MenuItem value="" disabled>
                    Select a category
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id || category.category_name}>
                      {category.category_name}
                    </MenuItem>
                  ))}
                </>
              )}
            </Select>
            {formErrors.category && (
              <Typography variant="caption" color="error">
                {formErrors.category}
              </Typography>
            )}
          </FormControl>
          
          <TextField
            fullWidth
            margin="normal"
            id="reward_minutes"
            name="reward_minutes"
            label="Reward (minutes)"
            type="number"
            value={editForm.reward_minutes}
            onChange={handleFormChange}
            error={!!formErrors.reward_minutes}
            helperText={formErrors.reward_minutes}
            disabled={dialogLoading}
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
              value={editForm.deadlineDate}
              onChange={handleFormChange}
              error={!!formErrors.deadlineDate}
              helperText={formErrors.deadlineDate}
              disabled={dialogLoading}
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
              value={editForm.deadlineTime}
              onChange={handleFormChange}
              error={!!formErrors.deadlineTime}
              helperText={formErrors.deadlineTime}
              disabled={dialogLoading}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} disabled={dialogLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateTask}
            color="primary"
            disabled={dialogLoading}
            autoFocus
          >
            {dialogLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Task Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialogs}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} disabled={dialogLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteTask}
            color="error"
            disabled={dialogLoading}
            autoFocus
          >
            {dialogLoading ? 'Deleting...' : 'Delete Task'}
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
    </Layout>
  );
};

export default TaskDetail;