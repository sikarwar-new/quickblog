import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Pages
import Home from './pages/Home';
import BlogDetail from './pages/BlogDetail';
import Login from './components/admin/Login';
import Signup from './components/admin/Signup';
import Layout from './pages/admin/Layout';
import DashBoard from './pages/admin/DashBoard';
import AddBlog from './pages/admin/AddBlog';
import ListBlog from './pages/admin/ListBlog';
import Comments from './pages/admin/Comments';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          
          {/* Auth Routes - Only accessible when not logged in */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          
          {/* Protected Routes - For authenticated users */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<DashBoard />} />
            <Route path="addblog" element={<AddBlog />} />
            <Route path="listblog" element={<ListBlog />} />
            <Route path="comments" element={<Comments />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;