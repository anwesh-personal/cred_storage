import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button, Card } from '../components/ui';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    price: '',
    category: '',
    purchase_date: new Date().toISOString().split('T')[0],
    features: {}
  });
  
  const [featureKey, setFeatureKey] = useState('');
  const [featureValue, setFeatureValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addFeature = () => {
    if (!featureKey.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureKey]: featureValue
      }
    }));
    
    setFeatureKey('');
    setFeatureValue('');
  };

  const removeFeature = (key: string) => {
    setFormData(prev => {
      const newFeatures = { ...prev.features };
      delete newFeatures[key];
      return { ...prev, features: newFeatures };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            user_id: userData.user.id,
            name: formData.name,
            description: formData.description,
            url: formData.url,
            price: parseFloat(formData.price),
            category: formData.category,
            purchase_date: formData.purchase_date,
            features: formData.features
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast.success('Product added successfully');
      navigate('/products');
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Error adding product');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Funnel Builder',
    'Email Marketing',
    'SEO',
    'Analytics',
    'Advertising',
    'Social Media',
    'Content Creation',
    'CRM',
    'Webinar',
    'Other'
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                  Website URL
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="url"
                    id="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Monthly Price ($) *
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="price"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description of the product and its main features.
                </p>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700">
                  Purchase Date
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="purchase_date"
                    id="purchase_date"
                    value={formData.purchase_date}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Features
                </label>
                <div className="mt-1 flex space-x-2">
                  <input
                    type="text"
                    value={featureKey}
                    onChange={(e) => setFeatureKey(e.target.value)}
                    placeholder="Feature name"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={featureValue}
                    onChange={(e) => setFeatureValue(e.target.value)}
                    placeholder="Value"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Add specific features like number of users, storage limits, etc.
                </p>

                {Object.keys(formData.features).length > 0 && (
                  <div className="mt-4 space-y-2">
                    {Object.entries(formData.features).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <div>
                          <span className="font-medium">{key}:</span> {value.toString()}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFeature(key)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/products')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={loading}
              >
                Add Product
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddProduct;
