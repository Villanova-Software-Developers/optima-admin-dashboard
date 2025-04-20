import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Container, 
  Typography, 
  Box, 
  CircularProgress,
  Divider,
  Paper
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import CommentIcon from '@mui/icons-material/Comment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import Layout from '../components/common/Layout';
import StatCard from '../components/dashboard/StatCard';
import UserActivity from '../components/dashboard/UserActivity';
import RecentPosts from '../components/dashboard/RecentPosts';
import TaskStatsCard from '../components/community/TaskStatsCard';
import { getSummaryAnalysis } from '../api/analytics';
import { getUsers } from '../api/users';
import { getPosts } from '../api/posts';
import { getCommunityTaskStats } from '../api/community';
import AlertMessage from '../components/common/AlertMessage';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskStatsLoading, setTaskStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch analytics data
        const analyticsResponse = await getSummaryAnalysis();
        setAnalytics(analyticsResponse.summary);
        
        // Fetch recent users
        const usersResponse = await getUsers(5);
        setRecentUsers(usersResponse.users || []);
        
        // Fetch recent posts
        const postsResponse = await getPosts(5);
        setRecentPosts(postsResponse.posts || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    const fetchTaskStats = async () => {
      try {
        setTaskStatsLoading(true);
        
        // Fetch community task stats
        const response = await getCommunityTaskStats();
        if (response.success) {
          setTaskStats(response.stats || null);
        }
      } catch (err) {
        console.error('Error fetching community task stats:', err);
        // Don't set main error for task stats
      } finally {
        setTaskStatsLoading(false);
      }
    };

    fetchDashboardData();
    fetchTaskStats();
  }, []);

  const handleCloseAlert = () => {
    setError(null);
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ pt: 2, pb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Overview of the Optima app
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Analytics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Total Users"
                  value={analytics?.total_users || 0}
                  icon={<PeopleIcon />}
                  description={`${analytics?.new_users || 0} new in last ${analytics?.period_days || 30} days`}
                  color="#4caf50"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Total Posts"
                  value={analytics?.total_posts || 0}
                  icon={<ArticleIcon />}
                  description={`${analytics?.new_posts || 0} new in last ${analytics?.period_days || 30} days`}
                  color="#2196f3"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Total Comments"
                  value={analytics?.total_comments || 0}
                  icon={<CommentIcon />}
                  description={`${analytics?.new_comments || 0} new in last ${analytics?.period_days || 30} days`}
                  color="#ff9800"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Community Tasks"
                  value={taskStats?.total_tasks || 0}
                  icon={<GroupWorkIcon />}
                  description={`${taskStats?.active_tasks || 0} active tasks`}
                  color="#9c27b0"
                />
              </Grid>
            </Grid>

            {/* Community Tasks Stats */}
            <Box sx={{ mb: 4 }}>
              <TaskStatsCard stats={taskStats} loading={taskStatsLoading} />
            </Box>

            {/* Recent Activity & Posts */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <UserActivity users={recentUsers} />
              </Grid>
              <Grid item xs={12} md={6}>
                <RecentPosts posts={recentPosts} />
              </Grid>
            </Grid>
          </>
        )}

        {/* Error Alert */}
        <AlertMessage 
          open={!!error}
          message={error}
          severity="error"
          onClose={handleCloseAlert}
        />
      </Container>
    </Layout>
  );
};

export default Dashboard;