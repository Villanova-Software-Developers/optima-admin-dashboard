// src/pages/CommunityTasks.js
import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid
} from '@mui/material';
import Layout from '../components/common/Layout';
import TaskForm from '../components/community/TaskForm';

const CommunityTasks = () => {
  const handleTaskCreated = (task) => {
    console.log('Task created:', task);
    // In a real application, you might want to update a list of tasks here
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

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TaskForm onTaskCreated={handleTaskCreated} />
          </Grid>
          <Grid item xs={12} md={4}>
            {/* In the future, we could add task stats or guides here */}
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
      </Container>
    </Layout>
  );
};

export default CommunityTasks;