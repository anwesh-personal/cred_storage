import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, AIRecommendation } from '../types';
import { Card } from '../components/ui';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user's products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('purchase_date', { ascending: false })
          .limit(5);
        
        if (productsError) throw productsError;
        
        // Fetch AI recommendations
        const { data: recommendationsData, error: recommendationsError } = await supabase
          .from('ai_recommendations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (recommendationsError) throw recommendationsError;
        
        setProducts(productsData || []);
        setRecommendations(recommendationsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
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
      features: { keywords: 10000, projects: 5 }
    }
  ];

  const placeholderRecommendations: AIRecommendation[] = [
    {
      id: '1',
      user_id: '1',
      recommendation_type: 'product',
      content: 'Based on your current tools, you might benefit from adding Ahrefs to your SEO toolkit to complement SEMrush with backlink analysis.',
      score: 85
    },
    {
      id: '2',
      user_id: '1',
      recommendation_type: 'strategy',
      content: 'Consider integrating your email marketing with your funnel builder for better conversion tracking and automated follow-ups.',
      score: 92
    }
  ];

  const displayProducts = products.length > 0 ? products : placeholderProducts;
  const displayRecommendations = recommendations.length > 0 ? recommendations : placeholderRecommendations;

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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/add-product"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Add New Product
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={item} initial="hidden" animate="show">
              <Card className="border-l-4 border-primary-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                    <p className="text-2xl font-semibold text-gray-900">{displayProducts.length}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            <motion.div variants={item} initial="hidden" animate="show">
              <Card className="border-l-4 border-secondary-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 mr-4">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monthly Spend</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ${displayProducts.reduce((sum, product) => sum + product.price, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            <motion.div variants={item} initial="hidden" animate="show">
              <Card className="border-l-4 border-yellow-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Recommendations</p>
                    <p className="text-2xl font-semibold text-gray-900">{displayRecommendations.length}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Recent Products */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Recent Products</h2>
              <Link to="/products" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {displayProducts.map((product) => (
                <motion.div key={product.id} variants={item}>
                  <Link to={`/products/${product.id}`}>
                    <Card className="h-full hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ${product.price}/mo
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      <div className="mt-4 text-xs text-gray-500">
                        Purchased: {new Date(product.purchase_date).toLocaleDateString()}
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* AI Recommendations */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">AI Recommendations</h2>
            </div>
            
            <motion.div 
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {displayRecommendations.map((recommendation) => (
                <motion.div key={recommendation.id} variants={item}>
                  <Card className="border-l-4 border-secondary-500">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 mr-2">
                            {recommendation.recommendation_type.charAt(0).toUpperCase() + recommendation.recommendation_type.slice(1)}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Score: {recommendation.score}/100
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{recommendation.content}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
