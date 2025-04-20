import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import FilterListIcon from '@mui/icons-material/FilterList';
import { deleteCommunityTask } from '../../api/community';
import AlertMessage from '../common/AlertMessage';
import { formatDate } from '../../utils/format';

const TasksList = ({ tasks = [], onTaskAction }) => {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [filter, setFilter] = useState('all');

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    const now = new Date();
    const deadline = new Date(task.deadline);
    
    if (filter === 'active') {
      return deadline > now;
    } else if (filter === 'expired') {
      return deadline <= now;
    }
    
    return true; // 'all' filter
  });

  // View task details
  const handleViewTask = (taskId) => {
    navigate(`/community-tasks/${taskId}`);
  };

  // Edit task
  const handleEditTask = (taskId) => {
    navigate(`/community-tasks/${taskId}/edit`);
  };

  // Open delete confirmation
  const handleConfirmDelete = (task) => {
    setSelectedTask(task);
    setConfirmDelete(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setSelectedTask(null);
    setConfirmDelete(false);
  };

  // Delete task
  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    setLoading(true);
    try {
      await deleteCommunityTask(selectedTask.id);
      
      setAlert({
        open: true,
        message: 'Task deleted successfully',
        severity: 'success'
      });
      
      // Notify parent component
      if (onTaskAction) {
        onTaskAction({
          type: 'DELETE',
          taskId: selectedTask.id
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to delete task: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  // Change filter
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Close alert
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Check if task is expired
  const isTaskExpired = (deadline) => {
    const now = new Date();
    const taskDeadline = new Date(deadline);
    return taskDeadline <= now;
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControl sx={{ width: 200 }}>
          <InputLabel id="task-filter-label">
            <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> 
            Filter
          </InputLabel>
          <Select
            labelId="task-filter-label"
            id="task-filter"
            value={filter}
            label="Filter"
            onChange={handleFilterChange}
            size="small"
          >
            <MenuItem value="all">All Tasks</MenuItem>
            <MenuItem value="active">Active Tasks</MenuItem>
            <MenuItem value="expired">Expired Tasks</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Reward (min)</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Participants</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.category}</TableCell>
                  <TableCell>{task.reward_minutes}</TableCell>
                  <TableCell>{formatDate(task.deadline)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {task.participants_count || 0} joined
                      </Typography>
                      <Chip 
                        size="small" 
                        label={`${task.completed_count || 0} completed`}
                        color="success"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    {isTaskExpired(task.deadline) ? (
                      <Chip 
                        icon={<AccessTimeIcon />} 
                        label="Expired" 
                        color="error" 
                        size="small" 
                      />
                    ) : (
                      <Chip 
                        icon={<CheckCircleIcon />} 
                        label="Active" 
                        color="success" 
                        size="small" 
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ '& > button': { ml: 1 } }}>
                      <Tooltip title="View details">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleViewTask(task.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Edit task">
                        <IconButton 
                          size="small" 
                          color="info" 
                          onClick={() => handleEditTask(task.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete task">
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleConfirmDelete(task)}
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
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    {filter !== 'all' 
                      ? `No ${filter} tasks found`
                      : 'No tasks found'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the task "{selectedTask?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteTask}
            color="error"
            disabled={loading}
            autoFocus
          >
            {loading ? 'Deleting...' : 'Delete Task'}
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

export default TasksList;