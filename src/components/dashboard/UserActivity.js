// src/components/dashboard/UserActivity.js
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar,
  Typography,
  Divider 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns';

const UserActivity = ({ users = [] }) => {
  return (
    <Card>
      <CardHeader title="Recent User Activity" />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {users.length === 0 ? (
          <Typography variant="body2" sx={{ p: 2 }}>
            No recent user activity
          </Typography>
        ) : (
          <List sx={{ width: '100%' }}>
            {users.map((user, index) => (
              <React.Fragment key={user.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.username}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          {user.email}
                        </Typography>
                        {user.createdAt && (
                          <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                            sx={{ display: 'block' }}
                          >
                            {`Joined ${format(new Date(user.createdAt), 'PPP')}`}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {index < users.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default UserActivity;