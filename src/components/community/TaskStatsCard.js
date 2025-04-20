import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  useTheme
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const TaskStatsCard = ({ stats, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Card>
        <CardHeader title="Community Tasks Statistics" />
        <Divider />
        <CardContent sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader title="Community Tasks Statistics" />
        <Divider />
        <CardContent>
          <Typography variant="body1" align="center">
            No statistics available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for pie chart
  const chartData = {
    labels: ['Active Tasks', 'Expired Tasks'],
    datasets: [
      {
        data: [stats.active_tasks, stats.expired_tasks],
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.error.main,
        ],
        borderColor: [
          theme.palette.success.dark,
          theme.palette.error.dark,
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare category chart data if available
  const categoryData = stats.tasks_by_category && stats.tasks_by_category.length > 0
    ? {
        labels: stats.tasks_by_category.map(cat => cat.name),
        datasets: [
          {
            data: stats.tasks_by_category.map(cat => cat.count),
            backgroundColor: [
              '#4caf50', // green
              '#2196f3', // blue
              '#ff9800', // orange
              '#f44336', // red
              '#9c27b0', // purple
              '#00bcd4', // cyan
              '#795548', // brown
              '#607d8b', // grey
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <Card>
      <CardHeader title="Community Tasks Statistics" />
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          {/* Key Metrics */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Key Metrics
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'primary.main', 
                  color: 'primary.contrastText',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  mr: 1
                }}>
                  <CheckCircleIcon fontSize="small" />
                </Box>
                <Typography variant="body1">
                  Total Tasks: <strong>{stats.total_tasks}</strong>
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'success.main', 
                  color: 'success.contrastText',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  mr: 1
                }}>
                  <AccessTimeIcon fontSize="small" />
                </Box>
                <Typography variant="body1">
                  Active Tasks: <strong>{stats.active_tasks}</strong>
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'error.main', 
                  color: 'error.contrastText',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  mr: 1
                }}>
                  <AccessTimeIcon fontSize="small" />
                </Box>
                <Typography variant="body1">
                  Expired Tasks: <strong>{stats.expired_tasks}</strong>
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'info.main', 
                  color: 'info.contrastText',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  mr: 1
                }}>
                  <GroupIcon fontSize="small" />
                </Box>
                <Typography variant="body1">
                  Total Participants: <strong>{stats.total_participants}</strong>
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'success.main', 
                  color: 'success.contrastText',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  mr: 1
                }}>
                  <CheckCircleIcon fontSize="small" />
                </Box>
                <Typography variant="body1">
                  Completion Rate: <strong>{stats.completion_rate.toFixed(1)}%</strong>
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          {/* Active vs Expired Chart */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Active vs Expired Tasks
            </Typography>
            <Box sx={{ height: 200 }}>
              <Pie data={chartData} options={chartOptions} />
            </Box>
          </Grid>
          
          {/* Categories Chart - conditional rendering */}
          {categoryData && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Tasks by Category
              </Typography>
              <Box sx={{ height: 200 }}>
                <Pie data={categoryData} options={chartOptions} />
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TaskStatsCard;