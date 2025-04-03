import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Pagination = ({ 
  hasMore, 
  loading, 
  onLoadMore,
  page = 1,
  totalItems,
  itemsPerPage
}) => {
  const showingCount = Math.min(page * itemsPerPage, totalItems || Infinity);
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 2 
      }}
    >
      {totalItems !== undefined && (
        <Typography variant="body2" color="textSecondary">
          Showing {showingCount} of {totalItems} items
        </Typography>
      )}
      
      {hasMore && (
        <Button
          variant="outlined"
          size="small"
          onClick={onLoadMore}
          disabled={loading}
          endIcon={<NavigateNextIcon />}
        >
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </Box>
  );
};

export default Pagination;