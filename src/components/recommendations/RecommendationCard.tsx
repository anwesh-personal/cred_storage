import React from 'react';
import { motion } from 'framer-motion';
import { AIRecommendation } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, Clock, ThumbsDown, ThumbsUp } from 'lucide-react';
import Button from '../ui/Button';

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  onClick?: () => void;
  onMarkAsRead?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onClick,
  onMarkAsRead,
}) => {
  const { content, recommendation_type, is_read, created_at } = recommendation;
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const getRecommendationIcon = () => {
    switch (recommendation_type) {
      case 'product_purchase':
        return content.recommendation?.worth_buying ? 
          <ThumbsUp className="h-5 w-5 text-green-500" /> : 
          <ThumbsDown className="h-5 w-5 text-red-500" />;
      case 'user_insights':
        return <AlertCircle className="h-5 w-5 text-primary-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getRecommendationTitle = () => {
    switch (recommendation_type) {
      case 'product_purchase':
        return `Recommendation: ${content.product_name}`;
      case 'user_insights':
        return 'Your Marketing Profile Analysis';
      default:
        return 'AI Recommendation';
    }
  };
  
  const getRecommendationSummary = () => {
    switch (recommendation_type) {
      case 'product_purchase':
        const rec = content.recommendation;
        if (!rec) return 'No recommendation available';
        
        return rec.worth_buying
          ? `This product is worth buying! ${rec.budget_analysis.within_budget ? 'It fits within your budget.' : 'However, it exceeds your budget.'}`
          : `This product is not recommended. ${rec.similarity_to_existing.has_similar ? 'You already have similar products.' : ''}`;
      
      case 'user_insights':
        const insights = content.insights;
        if (!insights) return 'No insights available';
        
        return `Based on your purchases, your primary goal appears to be ${insights.primary_goal}. You're interested in ${insights.interest_areas.slice(0, 2).join(', ')}.`;
      
      default:
        return 'View recommendation details';
    }
  };

  return (
    <Card 
      className={`transition-all duration-300 hover:shadow-lg ${!is_read ? 'border-l-4 border-l-primary-500' : ''}`}
      interactive
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="p-2 rounded-full bg-gray-100 mr-3">
            {getRecommendationIcon()}
          </div>
          
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{getRecommendationTitle()}</h3>
            <p className="text-gray-600 mt-1">{getRecommendationSummary()}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <Badge 
            variant={recommendation_type === 'product_purchase' ? 'primary' : 'secondary'}
            size="sm"
          >
            {recommendation_type.replace('_', ' ')}
          </Badge>
          
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Clock className="h-4 w-4 mr-1" />
            {formatDate(created_at)}
          </div>
        </div>
      </div>
      
      {!is_read && onMarkAsRead && (
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<CheckCircle className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead();
            }}
          >
            Mark as read
          </Button>
        </div>
      )}
    </Card>
  );
};

export default RecommendationCard;
