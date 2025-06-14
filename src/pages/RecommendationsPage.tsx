import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRecommendationStore } from '../store/recommendationStore';
import { useProductStore } from '../store/productStore';
import RecommendationCard from '../components/recommendations/RecommendationCard';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, X, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import ProductRecommendationForm from '../components/recommendations/ProductRecommendationForm';
import { ProductRecommendationResponse } from '../types';
import RecommendationDetail from '../components/recommendations/RecommendationDetail';

const RecommendationsPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuthStore();
  const { 
    recommendations, 
    fetchRecommendations, 
    isLoading: recommendationsLoading,
    markAsRead
  } = useRecommendationStore();
  const { products, fetchProducts } = useProductStore();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [readFilter, setReadFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [isNewRecommendationModalOpen, setIsNewRecommendationModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<ProductRecommendationResponse | null>(null);
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchRecommendations(user.id);
      if (products.length === 0) {
        fetchProducts(user.id);
      }
    }
  }, [user, authLoading, navigate, fetchRecommendations, fetchProducts, products.length]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
  };
  
  const handleReadFilterChange = (value: string) => {
    setReadFilter(value);
  };
  
  const handleSortChange = (value: string) => {
    setSortOrder(value as 'asc' | 'desc');
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setReadFilter('all');
    setSortOrder('desc');
  };
  
  const handleMarkAllAsRead = async () => {
    const unreadRecommendations = recommendations.filter(rec => !rec.is_read);
    for (const rec of unreadRecommendations) {
      await markAsRead(rec.id);
    }
  };
  
  const handleRecommendationSubmit = (result: ProductRecommendationResponse) => {
    setRecommendationResult(result);
    setIsNewRecommendationModalOpen(false);
    setIsResultModalOpen(true);
  };
  
  const filteredRecommendations = recommendations
    .filter(recommendation => {
      const matchesSearch = searchTerm === '' || 
        JSON.stringify(recommendation.content).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === '' || recommendation.recommendation_type === typeFilter;
      
      const matchesReadStatus = 
        readFilter === 'all' || 
        (readFilter === 'read' && recommendation.is_read) || 
        (readFilter === 'unread' && !recommendation.is_read);
      
      return matchesSearch && matchesType && matchesReadStatus;
    })
    .sort((a, b) => {
      return sortOrder === 'desc' 
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
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

  if (authLoading || recommendationsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const unreadCount = recommendations.filter(rec => !rec.is_read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Recommendations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Get personalized insights and recommendations for your marketing purchases
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              leftIcon={<CheckCircle className="h-5 w-5" />}
              onClick={handleMarkAllAsRead}
            >
              Mark All as Read
            </Button>
          )}
          
          <Button
            leftIcon={<Plus className="h-5 w-5" />}
            onClick={() => setIsNewRecommendationModalOpen(true)}
            disabled={products.length === 0}
          >
            New Recommendation
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
              label="Search Recommendations"
              placeholder="Search in recommendation content..."
              value={searchTerm}
              onChange={handleSearch}
              leftIcon={<Search className="h-5 w-5" />}
              fullWidth
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select
              label="Type"
              options={[
                { value: '', label: 'All Types' },
                { value: 'product_purchase', label: 'Product Purchase' },
                { value: 'user_insights', label: 'User Insights' }
              ]}
              value={typeFilter}
              onChange={handleTypeChange}
              fullWidth
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select
              label="Status"
              options={[
                { value: 'all', label: 'All' },
                { value: 'read', label: 'Read' },
                { value: 'unread', label: 'Unread' }
              ]}
              value={readFilter}
              onChange={handleReadFilterChange}
              fullWidth
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select
              label="Sort By"
              options={[
                { value: 'desc', label: 'Newest First' },
                { value: 'asc', label: 'Oldest First' }
              ]}
              value={sortOrder}
              onChange={handleSortChange}
              fullWidth
            />
          </div>
          
          <div className="md:ml-2">
            <Button
              variant="outline"
              leftIcon={<X className="h-5 w-5" />}
              onClick={clearFilters}
              disabled={!searchTerm && !typeFilter && readFilter === 'all' && sortOrder === 'desc'}
            >
              Clear
            </Button>
          </div>
        </div>
        
        {(searchTerm || typeFilter || readFilter !== 'all') && (
          <div className="mt-4 flex items-center">
            <Filter className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">
              Showing {filteredRecommendations.length} of {recommendations.length} recommendations
            </span>
          </div>
        )}
      </motion.div>
      
      {filteredRecommendations.length > 0 ? (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredRecommendations.map(recommendation => (
            <motion.div key={recommendation.id} variants={itemVariants}>
              <RecommendationCard 
                recommendation={recommendation} 
                onClick={() => navigate(`/recommendations/${recommendation.id}`)}
                onMarkAsRead={() => markAsRead(recommendation.id)}
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
          {recommendations.length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
              <p className="text-gray-500 mb-6">
                {products.length === 0 ? (
                  "You need to add products before getting recommendations."
                ) : (
                  "Get personalized AI recommendations for your marketing product purchases."
                )}
              </p>
              {products.length === 0 ? (
                <Button
                  onClick={() => navigate('/products/add')}
                  leftIcon={<Plus className="h-5 w-5" />}
                >
                  Add Your First Product
                </Button>
              ) : (
                <Button
                  onClick={() => setIsNewRecommendationModalOpen(true)}
                  leftIcon={<Plus className="h-5 w-5" />}
                >
                  Get Your First Recommendation
                </Button>
              )}
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No matching recommendations</h3>
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
      
      {/* New Recommendation Modal */}
      <Modal
        isOpen={isNewRecommendationModalOpen}
        onClose={() => setIsNewRecommendationModalOpen(false)}
        title="Get Product Recommendation"
        size="lg"
      >
        <ProductRecommendationForm 
          products={products}
          onSubmit={handleRecommendationSubmit}
        />
      </Modal>
      
      {/* Recommendation Result Modal */}
      {recommendationResult && (
        <Modal
          isOpen={isResultModalOpen}
          onClose={() => setIsResultModalOpen(false)}
          title="Recommendation Result"
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Is it worth buying?
              </h2>
              <div>
                {recommendationResult.worth_buying ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Recommended
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <X className="h-4 w-4 mr-1" />
                    Not Recommended
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-gray-700">{recommendationResult.recommendation}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Budget Analysis</h3>
                <p className={`${recommendationResult.budget_analysis.within_budget ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {recommendationResult.budget_analysis.within_budget ? 'Within Budget' : 'Exceeds Budget'}
                </p>
                <p className="text-sm text-gray-600 mt-1">{recommendationResult.budget_analysis.budget_impact}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Goal Alignment</h3>
                <p className="font-medium">Score: {recommendationResult.goal_alignment.alignment_score}/10</p>
                <p className="text-sm text-gray-600 mt-1">
                  {recommendationResult.goal_alignment.aligned_goals.length} aligned goals, {recommendationResult.goal_alignment.misaligned_goals.length} misaligned
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Similar Products</h3>
                <p className={`font-medium ${recommendationResult.similarity_to_existing.has_similar ? 'text-red-600' : 'text-green-600'}`}>
                  {recommendationResult.similarity_to_existing.has_similar ? 'Similar Products Found' : 'No Similar Products'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {recommendationResult.similarity_to_existing.similar_products.length} similar products found
                </p>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button onClick={() => setIsResultModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RecommendationsPage;
