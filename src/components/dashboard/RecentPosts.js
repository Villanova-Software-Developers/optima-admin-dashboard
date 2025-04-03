// src/components/dashboard/RecentPosts.js
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  Typography,
  Divider,
  Box,
  Chip
} from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const RecentPosts = ({ posts = [] }) => {
  const navigate = useNavigate();
  
  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };
  
  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };
  
  return (
    <Card>
      <CardHeader title="Recent Posts" />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {posts.length === 0 ? (
          <Typography variant="body2" sx={{ p: 2 }}>
            No recent posts
          </Typography>
        ) : (
          <List sx={{ width: '100%' }}>
            {posts.map((post, index) => (
              <React.Fragment key={post.id}>
                <ListItem 
                  alignItems="flex-start" 
                  button 
                  onClick={() => handlePostClick(post.id)}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        By {post.username}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                          sx={{ display: 'block', mb: 1 }}
                        >
                          {truncateContent(post.content)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="textSecondary">
                            {post.createdAt && format(new Date(post.createdAt), 'PPP')}
                          </Typography>
                          <Box>
                            <Chip 
                              label={`${post.likeCount || 0} likes`} 
                              size="small" 
                              sx={{ mr: 1 }} 
                            />
                            <Chip 
                              label={`${post.commentCount || 0} comments`} 
                              size="small" 
                            />
                          </Box>
                        </Box>
                      </>
                    }
                  />
                </ListItem>
                {index < posts.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentPosts;