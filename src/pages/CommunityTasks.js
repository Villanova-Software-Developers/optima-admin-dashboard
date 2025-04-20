// src/pages/CommunityTasks.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Divider
} from '@mui/material';
import Layout from '../components/common/Layout';
import TaskForm from '../components/community/TaskForm';
import TasksList from '../components/community/TasksList';
import TaskStatsCard from '../components/community/TaskStatsCard';
import AlertMessage from '../components/common/AlertMessage';
import { getCommunityTasks, getCommunityTaskStats } from '../api/community';

const CommunityTasks = () => {
  const [tabValue, setTabValue] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger data refresh

  // Fetch tasks and statistics
  useEffect(() => {
    const fetchTasksData = async () => {
      try {
        setLoading(true);
        // Fetch tasks
        const tasksResponse = await getCommunityTasks();
        if (tasksResponse.success) {
          setTasks(tasksResponse.tasks || []);
        } else {
          setError('Failed to load community tasks');
        }
      } catch (err) {
        console.error('Error fetching community tasks:', err);
        setError('Failed to load community tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchStatsData = async () => {
      try {
        setStatsLoading(true);
        // Fetch statistics
        const statsResponse = await getCommunityTaskStats();
        if (statsResponse.success) {
          setStats(statsResponse.stats || null);
        }
      } catch (err) {
        console.error('Error fetching community task stats:', err);
        // Don't set error for stats, as it's not critical
      } finally {
        setStatsLoading(false);
      }
    };

    fetchTasksData();
    fetchStatsData();
  }, [refreshKey]);

  // Handle tab change
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle task created event
  const handleTaskCreated = (task) => {
    setAlert({
      open: true,
      message: 'Task created successfully',
      severity: 'success'
    });
    
    // Refresh data
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Handle task actions (edit, delete)
  const handleTaskAction = ({ type, taskId }) => {
    if (type === 'DELETE') {
      // Remove task from state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      setAlert({
        open: true,
        message: 'Task deleted successfully',
        severity: 'success'
      });
      
      // Refresh stats
      getCommunityTaskStats()
        .then(response => {
          if (response.success) {
            setStats(response.stats || null);
          }
        })
        .catch(err => console.error('Error refreshing stats:', err));
    }
  };

  // Close alert
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ pt: 2, pb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Community Tasks
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Create and manage community tasks for users
          </Typography>
        </Box>
        
        {/* Statistics Card */}
        <TaskStatsCard stats={stats} loading={statsLoading} />
        
        <Paper sx={{ mt: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="All Tasks" />
            <Tab label="Create New Task" />
          </Tabs>
          
          <Divider />
          
          {/* Tab Content */}
          {tabValue === 0 && (
            <Box p={3}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TasksList 
                  tasks={tasks}
                  onTaskAction={handleTaskAction}
                />
              )}
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box p={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <TaskForm onTaskCreated={handleTaskCreated} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      About Community Tasks
                    </Typography>
                    <Typography variant="body2">
                      Community tasks encourage users to participate in activities that promote wellbeing.
                      Each task has a time reward that users can earn by completing the task.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      <strong>Tips:</strong>
                      <ul>
                        <li>Keep task titles clear and action-oriented</li>
                        <li>Set reasonable deadlines (at least 24 hours)</li>
                        <li>Assign rewards proportional to effort required</li>
                      </ul>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Container>
      
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

export default CommunityTasks;