// src/components/users/UserPosts.js
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material';
import React from 'react';
import { formatDate } from '../../utils/format';

const UserPosts = ({ posts = [], onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader 
        title="User Posts" 
        subheader={`Total: ${posts.length} posts`}
      />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {posts.length === 0 ? (
          <Typography variant="body2" sx={{ p: 2 }}>
            This user has not created any posts yet.
          </Typography>
        ) : (
          <List sx={{ width: '100%' }}>
            {posts.map((post, index) => (
              <React.Fragment key={post.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">
                          {formatDate(post.createdAt)}
                        </Typography>
                        <Box>
                          {onEdit && (
                            <Tooltip title="Edit post">
                              <IconButton 
                                size="small" 
                                onClick={() => onEdit(post)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {onDelete && (
                            <Tooltip title="Delete post">
                              <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => onDelete(post)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="div"
                          variant="body2"
                          color="textPrimary"
                          sx={{ mt: 1, mb: 2 }}
                        >
                          {post.content}
                        </Typography>
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

export default UserPosts;