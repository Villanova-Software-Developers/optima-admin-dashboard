// src/pages/Posts.js
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
import PostsList from '../components/posts/PostsList';
import Pagination from '../components/common/Pagination';
import AlertMessage from '../components/common/AlertMessage';
import { getPosts } from '../api/posts';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [lastPost, setLastPost] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Load initial posts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts when search query changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = posts.filter(post => 
        post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  // Fetch posts from API
  const fetchPosts = async (startAfter = null) => {
    try {
      setLoading(true);
      const response = await getPosts(itemsPerPage, startAfter);
      
      if (response.success) {
        if (startAfter) {
          // Append new posts to existing list
          setPosts(prevPosts => [...prevPosts, ...response.posts]);
        } else {
          // Replace posts list with new data
          setPosts(response.posts || []);
        }
        
        setLastPost(response.last_post);
        setHasMore(!!response.last_post);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Load more posts
  const handleLoadMore = () => {
    if (lastPost && !loading) {
      fetchPosts(lastPost);
      setPage(prevPage => prevPage + 1);
    }
  };

  // Handle post actions (delete)
  const handlePostAction = ({ type, postId }) => {
    if (type === 'DELETE') {
      // Remove deleted post from state
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
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
            Post Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            View and manage all posts
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 4 }}>
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search by content or username..."
          />
          
          <Divider sx={{ mb: 3 }} />
          
          {loading && posts.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <PostsList 
                posts={filteredPosts} 
                onPostAction={handlePostAction} 
              />
              
              <Pagination 
                hasMore={hasMore && !searchQuery}
                loading={loading}
                onLoadMore={handleLoadMore}
                page={page}
                itemsPerPage={itemsPerPage}
                totalItems={posts.length}
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

export default Posts;