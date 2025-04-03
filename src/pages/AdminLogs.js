// src/pages/AdminLogs.js
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getAdminLogs } from '../api/logs';
import AlertMessage from '../components/common/AlertMessage';
import Layout from '../components/common/Layout';
import { formatDate } from '../utils/format';

// Action type to display color mapping
const actionTypeColors = {
  'ADMIN_CREATED': 'primary',
  'USER_DELETED': 'error',
  'USER_SUSPENDED': 'warning',
  'USER_UNSUSPENDED': 'success',
  'POST_DELETED': 'error',
  'POST_EDITED': 'info',
  'COMMENT_DELETED': 'error'
};

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async (limit = 100) => {
    try {
      setLoading(true);
      const response = await getAdminLogs(limit);
      
      if (response.success) {
        setLogs(response.logs || []);
      } else {
        setError('Failed to load admin logs');
      }
    } catch (err) {
      console.error('Error fetching admin logs:', err);
      setError('Failed to load admin logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore) return;
    
    try {
      setLoadingMore(true);
      // In a real app, you might implement pagination here
      // For now, we'll just fetch more logs
      const response = await getAdminLogs(logs.length + 50);
      
      if (response.success) {
        setLogs(response.logs || []);
      }
    } catch (err) {
      console.error('Error loading more logs:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCloseAlert = () => {
    setError(null);
  };

  // Helper to render details based on action type
  const renderDetails = (log) => {
    const details = log.details || {};
    
    switch (log.action_type) {
      case 'USER_DELETED':
        return (
          <Typography variant="body2">
            Deleted user: {details.username || details.email || details.user_id || 'Unknown user'}
            {details.posts_deleted && ` (${details.posts_deleted} posts deleted)`}
          </Typography>
        );
      case 'USER_SUSPENDED':
      case 'USER_UNSUSPENDED':
        return (
          <Typography variant="body2">
            {log.action_type === 'USER_SUSPENDED' ? 'Suspended' : 'Unsuspended'} user: {details.username || details.email || details.user_id || 'Unknown user'}
          </Typography>
        );
      case 'POST_DELETED':
        return (
          <Typography variant="body2">
            Deleted post by user: {details.user_id || 'Unknown user'}
            {details.content_preview && <Box sx={{ mt: 1, fontStyle: 'italic' }}>"{details.content_preview}"</Box>}
          </Typography>
        );
      case 'POST_EDITED':
        return (
          <Typography variant="body2">
            Edited post content
            {details.old_content_preview && (
              <Box sx={{ mt: 1 }}>
                <Box component="span" sx={{ fontWeight: 'bold' }}>Old: </Box>
                <Box component="span" sx={{ fontStyle: 'italic' }}>"{details.old_content_preview}"</Box>
              </Box>
            )}
            {details.new_content_preview && (
              <Box sx={{ mt: 0.5 }}>
                <Box component="span" sx={{ fontWeight: 'bold' }}>New: </Box>
                <Box component="span" sx={{ fontStyle: 'italic' }}>"{details.new_content_preview}"</Box>
              </Box>
            )}
          </Typography>
        );
      case 'COMMENT_DELETED':
        return (
          <Typography variant="body2">
            Deleted comment from post: {details.post_id}
            {details.content_preview && <Box sx={{ mt: 1, fontStyle: 'italic' }}>"{details.content_preview}"</Box>}
          </Typography>
        );
      case 'ADMIN_CREATED':
        return (
          <Typography variant="body2">
            New admin account: {details.admin_email || 'Unknown email'}
          </Typography>
        );
      default:
        return (
          <Typography variant="body2">
            {JSON.stringify(details)}
          </Typography>
        );
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ pt: 2, pb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Admin Activity Logs
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Track and monitor admin actions
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 4 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Admin</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.length > 0 ? (
                      logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{formatDate(log.timestamp)}</TableCell>
                          <TableCell>{log.admin_id}</TableCell>
                          <TableCell>
                            <Chip 
                              label={log.action_type}
                              color={actionTypeColors[log.action_type] || 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{renderDetails(log)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body1" sx={{ py: 2 }}>
                            No admin logs found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {logs.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="outlined" 
                    onClick={loadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Loading...' : 'Load More Logs'}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Container>

      <AlertMessage
        open={!!error}
        message={error}
        severity="error"
        onClose={handleCloseAlert}
      />
    </Layout>
  );
};

export default AdminLogs;