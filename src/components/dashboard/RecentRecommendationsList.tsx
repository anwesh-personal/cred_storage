import React from 'react';
import { Link } from 'react-router-dom';
import { AIRecommendation } from '../../types';
import { Calendar, ThumbsDown, ThumbsUp, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import Badge from '../ui/Badge';
import { motion } from 'framer-motion';

interface RecentRecommendationsListProps {
  recommendations: AIRecommendation[];
  limit?: number;
}

const RecentRecommendationsList: React.FC<RecentRecommendationsListProps> = ({
  recommendations,
  limit = 5,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const displayRecommendations = recommendations.slice(0, limit);

  const getRecommendationIcon = (recommendation: AIRecommendation) => {
    if (recommendation.recommendation_type === 'product_purchase') {
      return recommendation.content.recommendation?.worth_buying ? 
        <ThumbsUp className="h-5 w-5 text-green-500" /> : 
        <ThumbsDown className="h-5 w-5 text-red-500" />;
    }
    return <AlertCircle className="h-5 w-5 text-primary-500" />;
  };

  const getRecommendationTitle = (recommendation: AIRecommendation) => {
    if (recommendation.recommendation_type === 'product_purchase') {
      return `Recommendation: ${recommendation.content.product_name}`;
    }
    return 'Your Marketing Profile Analysis';
  };

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {displayRecommendations.map((recommendation, index) => (
          <motion.li
            key={recommendation.id}
            className={`py-4 ${!recommendation.is_read ? 'bg-gray-50' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 flex items-center">
                <div className="mr-3">
                  {getRecommendationIcon(recommendation)}
                </div>
                <div>
                  <p className="truncate text-sm font-medium text-gray-900">
                    <Link to={`/recommendations/${recommendation.id}`} className="hover:underline">
                      {getRecommendationTitle(recommendation)}
                    </Link>
                  </p>
                  <div className="flex items-center mt-1">
                    <Badge 
                      variant={recommendation.recommendation_type === 'product_purchase' ? 'primary' : 'secondary'}
                      size="sm"
                    >
                      {recommendation.recommendation_type.replace('_', ' ')}
                    </Badge>
                    <span className="mx-2 text-gray-300">•</span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(recommendation.created_at)}
                    </div>
                  </div>
                </div>
              </div>
              {!recommendation.is_read && (
                <div className="ml-4 flex-shrink-0">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    New
                  </span>
                </div>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
      
      {recommendations.length > limit && (
        <div className="mt-4 text-center">
          <Link
            to="/recommendations"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all recommendations
          </Link>
        </div>
      )}
      
      {recommendations.length === 0 && (
        <div className="py-6 text-center text-gray-500">
          <p>No recommendations yet</p>
          <Link
            to="/recommendations/new"
            className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Get your first recommendation
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentRecommendationsList;
