import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRecommendationStore } from '../store/recommendationStore';
import RecommendationDetail from '../components/recommendations/RecommendationDetail';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const RecommendationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { recommendations, fetchRecommendations, markAsRead } = useRecommendationStore();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user && (!recommendations || recommendations.length === 0)) {
      fetchRecommendations(user.id).then(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
    
    // Mark as read when viewing
    if (id && recommendations.find(r => r.id === id && !r.is_read)) {
      markAsRead(id);
    }
  }, [user, id, recommendations, fetchRecommendations, markAsRead]);
  
  const recommendation = recommendations.find(r => r.id === id);
  
  const handleMarkAsRead = async () => {
    if (!id) return;
    await markAsRead(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/recommendations')}
          className="mb-4"
        >
          Back to Recommendations
        </Button>
        
        <Card className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Recommendation Not Found</h2>
          <p className="text-gray-600 mb-6">
            The recommendation you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/recommendations')}>
            View All Recommendations
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/recommendations')}
          className="mb-4"
        >
          Back to Recommendations
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <RecommendationDetail 
            recommendation={recommendation}
            onMarkAsRead={!recommendation.is_read ? handleMarkAsRead : undefined}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default RecommendationDetailPage;
