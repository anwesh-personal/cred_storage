import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';
import ProductForm from '../components/products/ProductForm';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Product } from '../types';

const AddProductPage: React.FC = () => {
  const { user } = useAuthStore();
  const { addProduct } = useProductStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (data: Partial<Product>) => {
    if (!user) return;
    
    const productId = await addProduct(data, user.id);
    if (productId) {
      navigate(`/products/${productId}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/products')}
          className="mb-4"
        >
          Back to Products
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track a new marketing product you've purchased
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <ProductForm onSubmit={handleSubmit} />
        </Card>
      </motion.div>
    </div>
  );
};

export default AddProductPage;
