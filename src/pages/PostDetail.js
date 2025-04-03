// src/pages/PostDetail.js
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
  Paper,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deletePost, getPostDetails, updatePostContent } from '../api/posts';
import AlertMessage from '../components/common/AlertMessage';
import Layout from '../components/common/Layout';
import CommentsList from '../components/posts/CommentsList';
import { formatDate } from '../utils/format';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [dialogLoading, setDialogLoading] = useState(false);

  // Fetch post details
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        const response = await getPostDetails(postId);
        if (response.success) {
          setPost(response.post);
          setEditContent(response.post.content);
        } else {
          setError('Failed to load post details');
        }
      } catch (err) {
        console.error('Error fetching post details:', err);
        setError('Failed to load post details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  // Go back to posts list
  const handleGoBack = () => {
    navigate('/posts');
  };

  // Open edit dialog
  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  // Save edited post
  const handleSavePost = async () => {
    if (!post) return;
    
    setDialogLoading(true);
    try {
      await updatePostContent(post.id, editContent);
      
      setAlert({
        open: true,
        message: 'Post updated successfully',
        severity: 'success'
      });
      
      // Update local state
      setPost(prevPost => ({
        ...prevPost,
        content: editContent
      }));
      
      handleCloseEditDialog();
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to update post: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setDialogLoading(false);
    }
  };

  // Open delete dialog
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!post) return;
    
    setDialogLoading(true);
    try {
      await deletePost(post.id);
      
      setAlert({
        open: true,
        message: 'Post deleted successfully',
        severity: 'success'
      });
      
      // Navigate back to posts list after a short delay
      setTimeout(() => {
        navigate('/posts');
      }, 1500);
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to delete post: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setDialogLoading(false);
      handleCloseDeleteDialog();
    }
  };

  // Handle comment actions
  const handleCommentAction = ({ type, commentId }) => {
    if (type === 'DELETE' && post) {
      // Remove deleted comment from state
      setPost(prevPost => ({
        ...prevPost,
        comments: prevPost.comments.filter(comment => comment.id !== commentId)
      }));
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
            Post Details
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : post ? (
          <Grid container spacing={3}>
            {/* Post content card */}
            <Grid item xs={12}>
              <Card>
                <CardHeader 
                  title={`Post by ${post.username}`}
                  subheader={formatDate(post.createdAt)}
                  action={
                    <Box sx={{ display: 'flex' }}>
                      <Button
                        startIcon={<EditIcon />}
                        onClick={handleOpenEditDialog}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        startIcon={<DeleteIcon />}
                        color="error"
                        onClick={handleOpenDeleteDialog}
                      >
                        Delete
                      </Button>
                    </Box>
                  }
                />
                <Divider />
                <CardContent>
                  <Typography variant="body1" paragraph>
                    {post.content}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Chip 
                      label={`${post.likes?.length || 0} likes`} 
                      variant="outlined"
                    />
                    <Chip 
                      label={`${post.comments?.length || 0} comments`} 
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Comments section */}
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Comments" />
                <Divider />
                <CardContent>
                  <CommentsList 
                    postId={post.id}
                    comments={post.comments || []}
                    onCommentAction={handleCommentAction}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" align="center">
              Post not found
            </Typography>
          </Paper>
        )}
      </Container>

      {/* Edit Post Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
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
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} disabled={dialogLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSavePost}
            color="primary"
            disabled={dialogLoading || !editContent.trim()}
            autoFocus
          >
            {dialogLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Post Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={dialogLoading}>
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

export default PostDetail;