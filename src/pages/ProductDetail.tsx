import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { Card, Button } from '../components/ui';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, DollarSign, Tag } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  // Placeholder data for demo purposes
  const placeholderProduct: Product = {
    id: '1',
    user_id: '1',
    name: 'ClickFunnels',
    description: 'Sales funnel builder with marketing automation features. Create high-converting sales funnels, landing pages, and marketing campaigns without needing technical skills.',
    url: 'https://clickfunnels.com',
    price: 97,
    category: 'Funnel Builder',
    purchase_date: '2023-05-15',
    features: { 
      pages: 20, 
      visitors: 20000,
      automations: true,
      templates: 50,
      support: '24/7',
      integrations: ['Stripe', 'PayPal', 'Mailchimp', 'ActiveCampaign']
    }
  };

  const displayProduct = product || placeholderProduct;

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link to="/products" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{displayProduct.name}</h2>
              <div className="mt-2 flex items-center">
                <Tag size={16} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">{displayProduct.category}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
              <div className="flex items-center text-lg font-bold text-gray-900">
                <DollarSign size={20} className="text-green-600" />
                {displayProduct.price}/month
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Calendar size={16} className="mr-1" />
                Purchased: {new Date(displayProduct.purchase_date).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <p className="mt-2 text-gray-600">{displayProduct.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Features</h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(displayProduct.features).map(([key, value]) => (
                <div key={key} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-900">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>{' '}
                    {Array.isArray(value) ? value.join(', ') : value.toString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:justify-between">
            <a
              href={displayProduct.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-500"
            >
              Visit Website <ExternalLink size={16} className="ml-1" />
            </a>
            <div className="mt-4 sm:mt-0">
              <Button
                variant="outline"
                className="mr-3"
              >
                Edit
              </Button>
              <Button
                variant="primary"
              >
                Get AI Analysis
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
