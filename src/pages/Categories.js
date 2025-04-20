import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Divider
} from '@mui/material';
import Layout from '../components/common/Layout';
import CategoryForm from '../components/community/CategoryForm';
import CategoriesList from '../components/community/CategoriesList';
import AlertMessage from '../components/common/AlertMessage';
import { getTaskCategories } from '../api/community';

const Categories = () => {
  const [tabValue, setTabValue] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger data refresh

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getTaskCategories();
        if (response.success) {
          setCategories(response.categories || []);
        } else {
          setError('Failed to load categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [refreshKey]);

  // Handle tab change
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle category created
  const handleCategoryCreated = (category) => {
    setAlert({
      open: true,
      message: 'Category created successfully',
      severity: 'success'
    });
    
    // Refresh data
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Handle category actions (edit, delete)
  const handleCategoryAction = ({ type, categoryId, data }) => {
    if (type === 'DELETE') {
      // Remove category from state
      setCategories(prevCategories => prevCategories.filter(cat => cat.id !== categoryId));
      
      setAlert({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success'
      });
    } else if (type === 'UPDATE') {
      // Update category in state
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.id === categoryId ? { ...cat, ...data } : cat
        )
      );
      
      setAlert({
        open: true,
        message: 'Category updated successfully',
        severity: 'success'
      });
    }
  };

  // Close alert
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ pt: 2, pb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Task Categories
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage categories for community tasks
          </Typography>
        </Box>
        
        <Paper sx={{ mt: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="All Categories" />
            <Tab label="Create New Category" />
          </Tabs>
          
          <Divider />
          
          {/* Tab Content */}
          {tabValue === 0 && (
            <Box p={3}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <CategoriesList 
                  categories={categories}
                  onCategoryAction={handleCategoryAction}
                />
              )}
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box p={3}>
              <CategoryForm onCategoryCreated={handleCategoryCreated} />
            </Box>
          )}
        </Paper>
      </Container>
      
      {/* Alert Message */}
      <AlertMessage
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={handleCloseAlert}
      />
    </Layout>
  );
};

export default Categories;