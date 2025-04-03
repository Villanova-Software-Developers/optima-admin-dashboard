// src/pages/Users.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Divider
} from '@mui/material';
import Layout from '../components/common/Layout';
import SearchBar from '../components/common/SearchBar';
import UsersList from '../components/users/UsersList';
import Pagination from '../components/common/Pagination';
import AlertMessage from '../components/common/AlertMessage';
import { getUsers } from '../api/users';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [lastUser, setLastUser] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Load initial users
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when search query changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(user => 
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  // Fetch users from API
  const fetchUsers = async (startAfter = null) => {
    try {
      setLoading(true);
      const response = await getUsers(itemsPerPage, startAfter);
      
      if (response.success) {
        if (startAfter) {
          // Append new users to existing list
          setUsers(prevUsers => [...prevUsers, ...response.users]);
        } else {
          // Replace users list with new data
          setUsers(response.users || []);
        }
        
        setLastUser(response.last_user);
        setHasMore(!!response.last_user);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Load more users
  const handleLoadMore = () => {
    if (lastUser && !loading) {
      fetchUsers(lastUser);
      setPage(prevPage => prevPage + 1);
    }
  };

  // Handle user actions (suspend, unsuspend, delete)
  const handleUserAction = ({ type, userId }) => {
    if (type === 'DELETE') {
      // Remove deleted user from state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } else if (type === 'SUSPEND' || type === 'UNSUSPEND') {
      // Update user's suspended status
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, suspended: type === 'SUSPEND' } 
            : user
        )
      );
    }
  };

  // Close error alert
  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ pt: 2, pb: 4 }}>
          <Typography variant="h4" gutterBottom>
            User Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            View and manage all users
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 4 }}>
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search by username or email..."
          />
          
          <Divider sx={{ mb: 3 }} />
          
          {loading && users.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <UsersList 
                users={filteredUsers} 
                onUserAction={handleUserAction} 
              />
              
              <Pagination 
                hasMore={hasMore && !searchQuery}
                loading={loading}
                onLoadMore={handleLoadMore}
                page={page}
                itemsPerPage={itemsPerPage}
                totalItems={users.length}
              />
            </>
          )}
        </Paper>
      </Container>

      <AlertMessage
        open={!!error}
        message={error}
        severity="error"
        onClose={handleCloseError}
      />
    </Layout>
  );
};

export default Users;