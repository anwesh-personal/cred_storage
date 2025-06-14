import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { Card, Button } from '../components/ui';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, ExternalLink, BarChart2 } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('purchase_date', { ascending: false });
        
        if (error) throw error;
        
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Placeholder data for demo purposes
  const placeholderProducts: Product[] = [
    {
      id: '1',
      user_id: '1',
      name: 'ClickFunnels',
      description: 'Sales funnel builder with marketing automation',
      url: 'https://clickfunnels.com',
      price: 97,
      category: 'Funnel Builder',
      purchase_date: '2023-05-15',
      created_at: '2023-05-15',
      features: { pages: 20, visitors: 20000 }
    },
    {
      id: '2',
      user_id: '1',
      name: 'ConvertKit',
      description: 'Email marketing platform for creators',
      url: 'https://convertkit.com',
      price: 29,
      category: 'Email Marketing',
      purchase_date: '2023-06-02',
      created_at: '2023-06-02',
      features: { subscribers: 1000, automations: true }
    },
    {
      id: '3',
      user_id: '1',
      name: 'SEMrush',
      description: 'All-in-one SEO and content marketing tool',
      url: 'https://semrush.com',
      price: 119.95,
      category: 'SEO',
      purchase_date: '2023-04-10',
      created_at: '2023-04-10',
      features: { keywords: 10000, projects: 5 }
    },
    {
      id: '4',
      user_id: '1',
      name: 'Ahrefs',
      description: 'SEO tools to grow your search traffic',
      url: 'https://ahrefs.com',
      price: 99,
      category: 'SEO',
      purchase_date: '2023-03-22',
      created_at: '2023-03-22',
      features: { keywords: 7500, projects: 3 }
    },
    {
      id: '5',
      user_id: '1',
      name: 'Mailchimp',
      description: 'Email marketing and automation platform',
      url: 'https://mailchimp.com',
      price: 17.99,
      category: 'Email Marketing',
      purchase_date: '2023-02-15',
      created_at: '2023-02-15',
      features: { subscribers: 2000, templates: 100 }
    },
    {
      id: '6',
      user_id: '1',
      name: 'Webflow',
      description: 'Website builder and CMS for designers',
      url: 'https://webflow.com',
      price: 35,
      category: 'Website Builder',
      purchase_date: '2023-01-10',
      created_at: '2023-01-10',
      features: { pages: 100, cms: true }
    }
  ];

  const displayProducts = products.length > 0 ? products : placeholderProducts;
  
  // Get unique categories for filter
  const categories = Array.from(new Set(displayProducts.map(product => product.category)));
  
  // Filter products based on search term and category
  const filteredProducts = displayProducts.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Calculate total monthly spend
  const totalMonthlySpend = filteredProducts.reduce((sum, product) => sum + product.price, 0);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your Products</h1>
        <Link
          to="/add-product"
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus size={16} className="mr-2" />
          Add New Product
        </Link>
      </div>

      {/* Filters and search */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="relative rounded-md shadow-sm flex-1 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search products..."
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="bg-gray-100 px-4 py-2 rounded-md">
              <span className="text-sm font-medium text-gray-500">Total:</span>{' '}
              <span className="text-sm font-bold text-gray-900">${totalMonthlySpend.toFixed(2)}/mo</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div key={product.id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ProductList;
