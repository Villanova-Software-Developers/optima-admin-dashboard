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
  Button
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatDate } from '../../utils/format';
import { suspendUser, deleteUser } from '../../api/users';
import AlertMessage from '../common/AlertMessage';

const UsersList = ({ users, onUserAction }) => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  // View user details
  const handleViewUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  // Open confirmation dialog
  const handleConfirmAction = (user, action) => {
    setSelectedUser(user);
    setConfirmAction(action);
  };

  // Close confirmation dialog
  const handleCloseDialog = () => {
    setSelectedUser(null);
    setConfirmAction(null);
  };

  // Suspend/unsuspend user
  const handleToggleSuspend = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      const isSuspending = !selectedUser.suspended;
      await suspendUser(selectedUser.id, isSuspending);
      
      setAlert({
        open: true,
        message: `User ${isSuspending ? 'suspended' : 'unsuspended'} successfully`,
        severity: 'success'
      });
      
      // Notify parent component to refresh data
      if (onUserAction) {
        onUserAction({
          type: isSuspending ? 'SUSPEND' : 'UNSUSPEND',
          userId: selectedUser.id
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to ${selectedUser.suspended ? 'unsuspend' : 'suspend'} user: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      await deleteUser(selectedUser.id);
      
      setAlert({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
      
      // Notify parent component to refresh data
      if (onUserAction) {
        onUserAction({
          type: 'DELETE',
          userId: selectedUser.id
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: `Failed to delete user: ${error.message}`,
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
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Friends</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell component="th" scope="row">
                    {user.username}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>{user.friends}</TableCell>
                  <TableCell>
                    {user.suspended ? (
                      <Chip 
                        label="Suspended" 
                        color="error" 
                        size="small" 
                        icon={<BlockIcon fontSize="small" />} 
                      />
                    ) : (
                      <Chip 
                        label="Active" 
                        color="success" 
                        size="small" 
                        icon={<CheckCircleIcon fontSize="small" />} 
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ '& > button': { ml: 1 } }}>
                      <Tooltip title="View details">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleViewUser(user.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title={user.suspended ? "Unsuspend user" : "Suspend user"}>
                        <IconButton 
                          size="small" 
                          color={user.suspended ? "success" : "warning"} 
                          onClick={() => handleConfirmAction(user, user.suspended ? 'unsuspend' : 'suspend')}
                        >
                          {user.suspended ? <CheckCircleIcon /> : <BlockIcon />}
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete user">
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleConfirmAction(user, 'delete')}
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
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No users found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={Boolean(selectedUser && confirmAction)}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          {confirmAction === 'delete' && "Delete User"}
          {confirmAction === 'suspend' && "Suspend User"}
          {confirmAction === 'unsuspend' && "Unsuspend User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmAction === 'delete' && (
              <>
                Are you sure you want to delete the user 
                <strong>{` ${selectedUser?.username || selectedUser?.email}`}</strong>?
                This action will also delete all of their posts and cannot be undone.
              </>
            )}
            {confirmAction === 'suspend' && (
              <>
                Are you sure you want to suspend the user 
                <strong>{` ${selectedUser?.username || selectedUser?.email}`}</strong>?
                They will not be able to log in or use the app while suspended.
              </>
            )}
            {confirmAction === 'unsuspend' && (
              <>
                Are you sure you want to unsuspend the user 
                <strong>{` ${selectedUser?.username || selectedUser?.email}`}</strong>?
                This will restore their access to the app.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={confirmAction === 'delete' ? handleDeleteUser : handleToggleSuspend}
            color={confirmAction === 'delete' ? 'error' : (confirmAction === 'suspend' ? 'warning' : 'success')}
            disabled={loading}
            autoFocus
          >
            {loading ? 'Processing...' : 'Confirm'}
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

export default UsersList;