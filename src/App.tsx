import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ProductEvaluation from './pages/ProductEvaluation';

// Mock user for development
const mockUser = {
  id: 'mock-user-id',
  email: 'dev@example.com',
  created_at: new Date().toISOString()
};

function App() {
  return (
    <Routes>
      <Route element={<Layout user={mockUser} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/:id/evaluate" element={<ProductEvaluation />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
