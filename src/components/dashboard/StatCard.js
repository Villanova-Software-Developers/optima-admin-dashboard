// src/components/dashboard/StatCard.js
import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Avatar,
  useTheme
} from '@mui/material';

const StatCard = ({ title, value, icon, description, color }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {description && (
              <Typography variant="body2" color="textSecondary">
                {description}
              </Typography>
            )}
          </Box>
          <Avatar 
            sx={{ 
              backgroundColor: color || theme.palette.primary.main,
              height: 56,
              width: 56
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;