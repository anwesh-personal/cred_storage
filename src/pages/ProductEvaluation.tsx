import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, ProductRecommendationRequest } from '../types';
import { Card, Button } from '../components/ui';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, DollarSign, AlertTriangle, CheckCircle, XCircle, BarChart2 } from 'lucide-react';
import ProductRecommendationForm from '../components/recommendations/ProductRecommendationForm';
import ProductEvaluationChart from '../components/evaluation/ProductEvaluationChart';
import ProductMindMap from '../components/evaluation/ProductMindMap';
import ProductFlowChart from '../components/evaluation/ProductFlowChart';
import DigitalLitterbox from '../components/evaluation/DigitalLitterbox';
import { useRecommendationStore } from '../store/recommendationStore';

const ProductEvaluation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'mindmap' | 'flowchart' | 'litterbox'>('overview');
  const [recommendationResult, setRecommendationResult] = useState<any>(null);
  
  const { isLoading } = useRecommendationStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        if (!id) return;
        
        // Fetch the product
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setProduct(data);
        
        // Fetch related products (same category)
        if (data?.category) {
          const { data: relatedData, error: relatedError } = await supabase
            .from('products')
            .select('*')
            .eq('category', data.category)
            .neq('id', id)
            .limit(5);
          
          if (relatedError) throw relatedError;
          
          setRelatedProducts(relatedData || []);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        // For demo, use placeholder data
        setProduct({
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
        });
        
        setRelatedProducts([
          {
            id: '7',
            user_id: '1',
            name: 'Kartra',
            description: 'All-in-one platform for online businesses',
            url: 'https://kartra.com',
            price: 99,
            category: 'Funnel Builder',
            purchase_date: '2023-01-05',
            created_at: '2023-01-05'
          },
          {
            id: '8',
            user_id: '1',
            name: 'Leadpages',
            description: 'Landing page builder for small businesses',
            url: 'https://leadpages.com',
            price: 37,
            category: 'Funnel Builder',
            purchase_date: '2022-11-20',
            created_at: '2022-11-20'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleRecommendationResult = (result: any) => {
    setRecommendationResult(result);
    setActiveTab('overview');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Product not found</h3>
        <p className="mt-1 text-sm text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
        <Button
          className="mt-6"
          onClick={() => navigate('/products')}
        >
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/products')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Product Evaluation</h1>
      </div>
      
      <Card className="overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">{product.name}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{product.category}</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ${product.price}/mo
            </span>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{product.description}</p>
              
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Features</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {product.features ? (
                    Object.entries(product.features).map(([key, value]) => (
                      <li key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value.toString()}
                      </li>
                    ))
                  ) : (
                    <li>No features specified</li>
                  )}
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Details</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Purchase Date:</span>
                  <p className="text-gray-900">{new Date(product.purchase_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Monthly Cost:</span>
                  <p className="text-gray-900">${product.price.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Annual Cost:</span>
                  <p className="text-gray-900">${(product.price * 12).toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Website:</span>
                  <p className="text-gray-900">
                    <a 
                      href={product.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-500"
                    >
                      Visit Website
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`${
                activeTab === 'mindmap'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('mindmap')}
            >
              Mind Map
            </button>
            <button
              className={`${
                activeTab === 'flowchart'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('flowchart')}
            >
              Flow Chart
            </button>
            <button
              className={`${
                activeTab === 'litterbox'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('litterbox')}
            >
              Digital Litterbox
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {recommendationResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="flex items-start">
                      {recommendationResult.worth_buying ? (
                        <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                      )}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {recommendationResult.worth_buying ? 'Recommended' : 'Not Recommended'}
                        </h3>
                        <p className="text-gray-600">{recommendationResult.recommendation}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                        <Target className="h-5 w-5 text-primary-500 mr-2" />
                        Goal Alignment
                      </h4>
                      <div className="flex items-center mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary-600 h-2.5 rounded-full" 
                            style={{ width: `${recommendationResult.goal_alignment.alignment_score * 10}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {Math.round(recommendationResult.goal_alignment.alignment_score * 10)}%
                        </span>
                      </div>
                      
                      {recommendationResult.goal_alignment.aligned_goals.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-xs font-medium text-gray-500 mb-1">Aligned Goals:</h5>
                          <div className="flex flex-wrap gap-1">
                            {recommendationResult.goal_alignment.aligned_goals.map((goal: string, index: number) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                              >
                                {goal}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {recommendationResult.goal_alignment.misaligned_goals.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-xs font-medium text-gray-500 mb-1">Misaligned Goals:</h5>
                          <div className="flex flex-wrap gap-1">
                            {recommendationResult.goal_alignment.misaligned_goals.map((goal: string, index: number) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                              >
                                {goal}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                    
                    <Card>
                      <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                        <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                        Budget Analysis
                      </h4>
                      <div className="flex items-center">
                        {recommendationResult.budget_analysis.within_budget ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                        )}
                        <span className="text-gray-700">
                          {recommendationResult.budget_analysis.within_budget ? 'Within budget' : 'Exceeds budget'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {recommendationResult.budget_analysis.budget_impact}
                      </p>
                    </Card>
                    
                    <Card>
                      <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                        <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />
                        Similarity Analysis
                      </h4>
                      {recommendationResult.similarity_to_existing.has_similar ? (
                        <div>
                          <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                            <span className="text-gray-700">
                              Similar products found
                            </span>
                          </div>
                          <div className="mt-2">
                            <h5 className="text-xs font-medium text-gray-500 mb-1">Similar Products:</h5>
                            <ul className="space-y-1">
                              {recommendationResult.similarity_to_existing.similar_products.map((product: any, index: number) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center justify-between">
                                  <span>{product.name}</span>
                                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                    {Math.round(product.similarity_score * 100)}% similar
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-gray-700">
                            No similar products found
                          </span>
                        </div>
                      )}
                    </Card>
                  </div>
                  
                  {recommendationResult.alternative_suggestions && recommendationResult.alternative_suggestions.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Alternative Suggestions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendationResult.alternative_suggestions.map((alt: any, index: number) => (
                          <Card key={index}>
                            <h5 className="font-medium text-gray-900">{alt.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{alt.reason}</p>
                            {alt.url && (
                              <a
                                href={alt.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-600 hover:text-primary-500 mt-2 inline-block"
                              >
                                Learn more
                              </a>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Get AI Recommendation</h3>
                  <ProductRecommendationForm 
                    products={[product, ...relatedProducts]} 
                    onSubmit={handleRecommendationResult}
                  />
                </div>
              )}
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Performance</h3>
                <ProductEvaluationChart product={product} />
              </div>
            </div>
          )}
          
          {activeTab === 'mindmap' && (
            <ProductMindMap product={product} relatedProducts={relatedProducts} />
          )}
          
          {activeTab === 'flowchart' && (
            <ProductFlowChart product={product} />
          )}
          
          {activeTab === 'litterbox' && (
            <DigitalLitterbox product={product} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductEvaluation;
