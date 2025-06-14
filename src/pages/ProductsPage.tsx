import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';
import ProductCard from '../components/products/ProductCard';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { PRODUCT_CATEGORIES } from '../lib/constants';
import { ProductCategory } from '../types';

const ProductsPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuthStore();
  const { products, fetchProducts, isLoading: productsLoading } = useProductStore();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | ''>('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchProducts(user.id);
    }
  }, [user, authLoading, navigate, fetchProducts]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value as ProductCategory | '');
  };
  
  const handleSortChange = (value: string) => {
    if (value === 'date_desc') {
      setSortBy('date');
      setSortOrder('desc');
    } else if (value === 'date_asc') {
      setSortBy('date');
      setSortOrder('asc');
    } else if (value === 'price_desc') {
      setSortBy('price');
      setSortOrder('desc');
    } else if (value === 'price_asc') {
      setSortBy('price');
      setSortOrder('asc');
    } else if (value === 'name_asc') {
      setSortBy('name');
      setSortOrder('asc');
    } else if (value === 'name_desc') {
      setSortBy('name');
      setSortOrder('desc');
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setSortBy('date');
    setSortOrder('desc');
  };
  
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' 
          ? new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime()
          : new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime();
      } else if (sortBy === 'price') {
        return sortOrder === 'desc' ? b.price - a.price : a.price - b.price;
      } else {
        return sortOrder === 'desc'
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      }
    });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (authLoading || productsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all your marketing product purchases
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button
            leftIcon={<Plus className="h-5 w-5" />}
            onClick={() => navigate('/products/add')}
          >
            Add Product
          </Button>
        </div>
      </motion.div>
      
      <motion.div
        className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <Input
              label="Search Products"
              placeholder="Search by name, description, or tags..."
              value={searchTerm}
              onChange={handleSearch}
              leftIcon={<Search className="h-5 w-5" />}
              fullWidth
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select
              label="Category"
              options={[
                { value: '', label: 'All Categories' },
                ...PRODUCT_CATEGORIES.map(cat => ({ value: cat.value, label: cat.label }))
              ]}
              value={categoryFilter}
              onChange={handleCategoryChange}
              fullWidth
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select
              label="Sort By"
              options={[
                { value: 'date_desc', label: 'Newest First' },
                { value: 'date_asc', label: 'Oldest First' },
                { value: 'price_desc', label: 'Price: High to Low' },
                { value: 'price_asc', label: 'Price: Low to High' },
                { value: 'name_asc', label: 'Name: A to Z' },
                { value: 'name_desc', label: 'Name: Z to A' },
              ]}
              value={`${sortBy}_${sortOrder}`}
              onChange={handleSortChange}
              fullWidth
            />
          </div>
          
          <div className="md:ml-2">
            <Button
              variant="outline"
              leftIcon={<X className="h-5 w-5" />}
              onClick={clearFilters}
              disabled={!searchTerm && !categoryFilter && sortBy === 'date' && sortOrder === 'desc'}
            >
              Clear
            </Button>
          </div>
        </div>
        
        {(searchTerm || categoryFilter !== '') && (
          <div className="mt-4 flex items-center">
            <Filter className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </span>
          </div>
        )}
      </motion.div>
      
      {filteredProducts.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProducts.map(product => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard 
                product={product} 
                onClick={() => navigate(`/products/${product.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {products.length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products added yet</h3>
              <p className="text-gray-500 mb-6">
                Start tracking your marketing product purchases by adding your first product.
              </p>
              <Button
                onClick={() => navigate('/products/add')}
                leftIcon={<Plus className="h-5 w-5" />}
              >
                Add Your First Product
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No matching products</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                leftIcon={<X className="h-5 w-5" />}
              >
                Clear Filters
              </Button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ProductsPage;
