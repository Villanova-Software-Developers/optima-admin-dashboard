import React from 'react';
import { Navigate } from 'react-router-dom';

import AdminLogs from './pages/AdminLogs';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PostDetail from './pages/PostDetail';
import Posts from './pages/Posts';
import Register from './pages/Register';
import UserDetail from './pages/UserDetail';
import Users from './pages/Users';

const routes = (isAuthenticated) => [
    {
        path: '/',
        element: isAuthenticated ? <Dashboard /> : <Navigate to='/login' />,
    },
    {
        path: '/login',
        element: !isAuthenticated ? <Login /> : <Navigate to='/' />,
    },
    {
        path: '/register',
        element: !isAuthenticated ? <Register /> : <Navigate to='/' />,
    },
    {
        path: '/users',
        element: isAuthenticated ? <Users /> : <Navigate to='/login' />,
    },
    {
        path: '/users/:userId',
        element: isAuthenticated ? <UserDetail /> : <Navigate to='/login' />,
    },
    {
        path: '/posts',
        element: isAuthenticated ? <Posts /> : <Navigate to='/login' />,
    },
    {
        path: '/posts/:postId',
        element: isAuthenticated ? <PostDetail /> : <Navigate to='/login' />,
    },
    {
        path: '/logs',
        element: isAuthenticated ? <AdminLogs /> : <Navigate to='/login' />,
    },
    {
        path: '*',
        element: <Navigate to='/' />,
    }
];

export default routes;
