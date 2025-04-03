// src/components/posts/CommentsList.js
import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate } from '../../utils/format';
import { deleteComment } from '../../api/posts';
import AlertMessage from '../common/AlertMessage';

const CommentsList = ({ postId, comments = [], onCommentAction }) => {
  const [selectedComment, setSelectedComment] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  // Open delete confirmation
  const handleConfirmDelete = (comment) => {
    setSelectedComment(comment);
    setConfirmDelete(true);
  };

  // Close confirmation dialog
  const handleCloseDialog = () => {
    setSelectedComment(null);
    setConfirmDelete(false);
  };

  // Delete comment
  const handleDeleteComment = async () => {
    if (!selectedComment || !postId) return;
    
    setLoading(true);
    try {
      await deleteComment(postId, selectedComment.id);
      
      setAlert({
        open: true,
        message: 'Comment deleted successfully',
        severity: 'success'
      });
      
      // Notify parent component to refresh data
      if (onCommentAction) {
        onCommentAction({
          type: 'DELETE',
          commentId: selectedComment.id
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to delete comment: ${error.message}`,
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
      {comments.length === 0 ? (
        <Typography variant="body2" sx={{ py: 2, textAlign: 'center' }}>
          No comments on this post
        </Typography>
      ) : (
        <List sx={{ width: '100%' }}>
          {comments.map((comment, index) => (
            <React.Fragment key={comment.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <Tooltip title="Delete comment">
                    <IconButton
                      edge="end"
                      size="small"
                      color="error"
                      onClick={() => handleConfirmDelete(comment)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="span" variant="subtitle2">
                        {comment.username}
                      </Typography>
                      <Typography component="span" variant="caption" color="textSecondary">
                        {formatDate(comment.createdAt)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      {comment.content}
                    </Typography>
                  }
                />
              </ListItem>
              {index < comments.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment? This action cannot be undone.
          </DialogContentText>
          {selectedComment && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2">Comment by {selectedComment.username}:</Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedComment.content}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteComment}
            color="error"
            disabled={loading}
            autoFocus
          >
            {loading ? 'Deleting...' : 'Delete Comment'}
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

export default CommentsList;