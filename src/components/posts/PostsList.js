// src/components/posts/PostsList.js
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
  Tooltip,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Chip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { formatDate, truncateText } from '../../utils/format';
import { deletePost } from '../../api/posts';
import AlertMessage from '../common/AlertMessage';

const PostsList = ({ posts, onPostAction }) => {
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  // View post details
  const handleViewPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  // Open edit post page
  const handleEditPost = (postId) => {
    navigate(`/posts/${postId}/edit`);
  };

  // Open delete confirmation
  const handleConfirmDelete = (post) => {
    setSelectedPost(post);
    setConfirmDelete(true);
  };

  // Close confirmation dialog
  const handleCloseDialog = () => {
    setSelectedPost(null);
    setConfirmDelete(false);
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!selectedPost) return;
    
    setLoading(true);
    try {
      await deletePost(selectedPost.id);
      
      setAlert({
        open: true,
        message: 'Post deleted successfully',
        severity: 'success'
      });
      
      // Notify parent component to refresh data
      if (onPostAction) {
        onPostAction({
          type: 'DELETE',
          postId: selectedPost.id
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to delete post: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Engagement</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.username}</TableCell>
                  <TableCell>{truncateText(post.content, 50)}</TableCell>
                  <TableCell>{formatDate(post.createdAt)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label={`${post.likeCount || 0} likes`} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label={`${post.commentCount || 0} comments`} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ '& > button': { ml: 1 } }}>
                      <Tooltip title="View details">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleViewPost(post.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Edit post">
                        <IconButton 
                          size="small" 
                          color="info" 
                          onClick={() => handleEditPost(post.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete post">
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleConfirmDelete(post)}
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
                    No posts found
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
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
          {selectedPost && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2">Post preview:</Typography>
              <Typography variant="body2" color="textSecondary">
                {truncateText(selectedPost.content, 100)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeletePost}
            color="error"
            disabled={loading}
            autoFocus
          >
            {loading ? 'Deleting...' : 'Delete Post'}
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

export default PostsList;