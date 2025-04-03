// src/pages/UserDetail.js
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deletePost, updatePostContent } from '../api/posts';
import { deleteUser, getUserDetails, suspendUser } from '../api/users';
import AlertMessage from '../components/common/AlertMessage';
import Layout from '../components/common/Layout';
import UserPosts from '../components/users/UserPosts';
import { formatDate } from '../utils/format';

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  
  // Dialog states
  const [confirmAction, setConfirmAction] = useState(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editPostContent, setEditPostContent] = useState('');

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await getUserDetails(userId);
        if (response.success) {
          setUser(response.user);
        } else {
          setError('Failed to load user details');
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  // Go back to users list
  const handleGoBack = () => {
    navigate('/users');
  };

  // Open confirmation dialog
  const handleOpenDialog = (action) => {
    setConfirmAction(action);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setConfirmAction(null);
    setSelectedPost(null);
    setEditPostContent('');
  };

  // Toggle suspend user
  const handleToggleSuspend = async () => {
    if (!user) return;
    
    setDialogLoading(true);
    try {
      const isSuspending = !user.suspended;
      await suspendUser(user.id, isSuspending);
      
      setAlert({
        open: true,
        message: `User ${isSuspending ? 'suspended' : 'unsuspended'} successfully`,
        severity: 'success'
      });
      
      // Update local state
      setUser(prevUser => ({
        ...prevUser,
        suspended: isSuspending
      }));
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to ${user.suspended ? 'unsuspend' : 'suspend'} user: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setDialogLoading(false);
      handleCloseDialog();
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!user) return;
    
    setDialogLoading(true);
    try {
      await deleteUser(user.id);
      
      setAlert({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
      
      // Navigate back to users list after a short delay
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to delete user: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setDialogLoading(false);
      handleCloseDialog();
    }
  };

  // Open edit post dialog
  const handleEditPost = (post) => {
    setSelectedPost(post);
    setEditPostContent(post.content);
    setConfirmAction('editPost');
  };

  // Save edited post
  const handleSavePost = async () => {
    if (!selectedPost) return;
    
    setDialogLoading(true);
    try {
      await updatePostContent(selectedPost.id, editPostContent);
      
      setAlert({
        open: true,
        message: 'Post updated successfully',
        severity: 'success'
      });
      
      // Update local state
      setUser(prevUser => ({
        ...prevUser,
        posts: prevUser.posts.map(post => 
          post.id === selectedPost.id 
            ? { ...post, content: editPostContent } 
            : post
        )
      }));
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to update post: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setDialogLoading(false);
      handleCloseDialog();
    }
  };

  // Open delete post dialog
  const handleOpenDeletePost = (post) => {
    setSelectedPost(post);
    setConfirmAction('deletePost');
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!selectedPost) return;
    
    setDialogLoading(true);
    try {
      await deletePost(selectedPost.id);
      
      setAlert({
        open: true,
        message: 'Post deleted successfully',
        severity: 'success'
      });
      
      // Update local state
      setUser(prevUser => ({
        ...prevUser,
        posts: prevUser.posts.filter(post => post.id !== selectedPost.id)
      }));
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to delete post: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setDialogLoading(false);
      handleCloseDialog();
    }
  };

  // Close alert
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
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
            User Details
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : user ? (
          <Grid container spacing={3}>
            {/* User info card */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader 
                  title="User Information"
                  avatar={
                    <Chip
                      icon={user.suspended ? <BlockIcon /> : <CheckCircleIcon />}
                      label={user.suspended ? "Suspended" : "Active"}
                      color={user.suspended ? "error" : "success"}
                    />
                  }
                />
                <Divider />
                <CardContent>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Username" 
                        secondary={user.username || "N/A"} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Email" 
                        secondary={user.email || "N/A"} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Joined" 
                        secondary={formatDate(user.createdAt) || "N/A"} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Friends" 
                        secondary={user.friends ? `${user.friends.length} friends` : "0 friends"} 
                      />
                    </ListItem>
                  </List>

                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color={user.suspended ? "success" : "warning"}
                      fullWidth
                      onClick={() => handleOpenDialog(user.suspended ? 'unsuspend' : 'suspend')}
                    >
                      {user.suspended ? "Unsuspend User" : "Suspend User"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => handleOpenDialog('delete')}
                    >
                      Delete User
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* User posts */}
            <Grid item xs={12} md={8}>
              <UserPosts 
                posts={user.posts || []} 
                onEdit={handleEditPost}
                onDelete={handleOpenDeletePost}
              />
            </Grid>
          </Grid>
        ) : (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" align="center">
              User not found
            </Typography>
          </Paper>
        )}
      </Container>

      {/* Confirmation Dialogs */}
      <Dialog
        open={confirmAction === 'suspend' || confirmAction === 'unsuspend'}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          {confirmAction === 'suspend' ? "Suspend User" : "Unsuspend User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmAction === 'suspend' ? (
              <>
                Are you sure you want to suspend this user? They will not be able to log in or use the app while suspended.
              </>
            ) : (
              <>
                Are you sure you want to unsuspend this user? This will restore their access to the app.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={dialogLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleToggleSuspend}
            color={confirmAction === 'suspend' ? "warning" : "success"}
            disabled={dialogLoading}
            autoFocus
          >
            {dialogLoading ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmAction === 'delete'}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon color="error" sx={{ mr: 1 }} />
            Delete User
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action will also delete all of their posts and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={dialogLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteUser}
            color="error"
            disabled={dialogLoading}
            autoFocus
          >
            {dialogLoading ? 'Processing...' : 'Delete User'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmAction === 'editPost'}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Post Content</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="post-content"
            label="Post Content"
            fullWidth
            multiline
            rows={6}
            value={editPostContent}
            onChange={(e) => setEditPostContent(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={dialogLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSavePost}
            color="primary"
            disabled={dialogLoading || !editPostContent.trim()}
            autoFocus
          >
            {dialogLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmAction === 'deletePost'}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={dialogLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeletePost}
            color="error"
            disabled={dialogLoading}
            autoFocus
          >
            {dialogLoading ? 'Deleting...' : 'Delete Post'}
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

export default UserDetail;