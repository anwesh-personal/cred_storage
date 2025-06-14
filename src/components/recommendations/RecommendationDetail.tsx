import React from 'react';
import { AIRecommendation, ProductRecommendationResponse } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { format } from 'date-fns';
import { 
  AlertCircle, 
  Calendar, 
  CheckCircle, 
  DollarSign, 
  ExternalLink, 
  Target, 
  ThumbsDown, 
  ThumbsUp, 
  TrendingUp 
} from 'lucide-react';
import Button from '../ui/Button';
import { motion } from 'framer-motion';

interface RecommendationDetailProps {
  recommendation: AIRecommendation;
  onMarkAsRead?: () => void;
}

const RecommendationDetail: React.FC<RecommendationDetailProps> = ({
  recommendation,
  onMarkAsRead,
}) => {
  const { content, recommendation_type, is_read, created_at } = recommendation;
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const renderProductPurchaseRecommendation = () => {
    const { product_name, product_url, recommendation: rec } = content;
    if (!rec) return <p>No recommendation data available</p>;
    
    const data = rec as ProductRecommendationResponse;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recommendation: {product_name}
            </h2>
            <a 
              href={product_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 flex items-center mt-1"
            >
              {product_url}
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="flex items-center">
            {data.worth_buying ? (
              <Badge variant="success" size="lg" className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1" />
                Recommended
              </Badge>
            ) : (
              <Badge variant="danger" size="lg" className="flex items-center">
                <ThumbsDown className="h-4 w-4 mr-1" />
                Not Recommended
              </Badge>
            )}
          </div>
        </div>
        
        <Card className="bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Summary</h3>
          <p className="text-gray-700">{data.recommendation}</p>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-md font-medium mb-3 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
              Budget Analysis
            </h3>
            <div className={`text-lg font-semibold mb-2 ${data.budget_analysis.within_budget ? 'text-green-600' : 'text-red-600'}`}>
              {data.budget_analysis.within_budget ? 'Within Budget' : 'Exceeds Budget'}
            </div>
            <p className="text-gray-700">{data.budget_analysis.budget_impact}</p>
          </Card>
          
          <Card>
            <h3 className="text-md font-medium mb-3 flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-500" />
              Goal Alignment
            </h3>
            <div className="text-lg font-semibold mb-2">
              Score: {data.goal_alignment.alignment_score}/10
            </div>
            {data.goal_alignment.aligned_goals.length > 0 && (
              <div className="mb-2">
                <div className="text-sm font-medium text-gray-700 mb-1">Aligned Goals:</div>
                <div className="flex flex-wrap gap-2">
                  {data.goal_alignment.aligned_goals.map((goal, index) => (
                    <Badge key={index} variant="success" size="sm">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {data.goal_alignment.misaligned_goals.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Misaligned Goals:</div>
                <div className="flex flex-wrap gap-2">
                  {data.goal_alignment.misaligned_goals.map((goal, index) => (
                    <Badge key={index} variant="danger" size="sm">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
          
          <Card>
            <h3 className="text-md font-medium mb-3 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Similarity Analysis
            </h3>
            <div className={`text-lg font-semibold mb-2 ${data.similarity_to_existing.has_similar ? 'text-red-600' : 'text-green-600'}`}>
              {data.similarity_to_existing.has_similar ? 'Similar Products Found' : 'No Similar Products'}
            </div>
            {data.similarity_to_existing.similar_products.length > 0 ? (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Similar to:</div>
                <ul className="list-disc pl-5 space-y-1">
                  {data.similarity_to_existing.similar_products.map((product, index) => (
                    <li key={index} className="text-gray-700">
                      {product.product_name} ({product.similarity_score.toFixed(1)}/10)
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-700">This product offers unique features compared to your existing products.</p>
            )}
          </Card>
        </div>
        
        {data.alternative_suggestions && data.alternative_suggestions.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold mb-3">Alternative Suggestions</h3>
            <ul className="space-y-3">
              {data.alternative_suggestions.map((alt, index) => (
                <li key={index} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
                  <div className="font-medium">{alt.name}</div>
                  {alt.url && (
                    <a 
                      href={alt.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                    >
                      {alt.url}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                  <p className="text-gray-700 mt-1">{alt.reason}</p>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    );
  };
  
  const renderUserInsightsRecommendation = () => {
    const { insights } = content;
    if (!insights) return <p>No insights data available</p>;
    
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Your Marketing Profile Analysis
          </h2>
          <p className="text-gray-600 mt-1">
            Based on your purchase history and product usage patterns
          </p>
        </div>
        
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50">
          <h3 className="text-lg font-semibold mb-3">Primary Goal</h3>
          <div className="text-xl font-bold text-gray-900 mb-2">
            {insights.primary_goal}
          </div>
          <p className="text-gray-700">
            Your purchase patterns indicate you're primarily focused on {insights.primary_goal.toLowerCase()}.
          </p>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-3">Spending Patterns</h3>
            <ul className="space-y-2">
              {insights.spending_patterns.map((pattern: string, index: number) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <span className="text-primary-500 mr-2">•</span>
                  <span className="text-gray-700">{pattern}</span>
                </motion.li>
              ))}
            </ul>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold mb-3">Interest Areas</h3>
            <div className="flex flex-wrap gap-2">
              {insights.interest_areas.map((area: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge variant="secondary" size="lg">
                    {area}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
        
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Skill Level</h3>
            <Badge 
              variant={
                insights.skill_level === 'Beginner' ? 'primary' :
                insights.skill_level === 'Intermediate' ? 'secondary' :
                'success'
              }
              size="lg"
            >
              {insights.skill_level}
            </Badge>
          </div>
          <p className="text-gray-700">
            Based on your product selections and usage patterns, you appear to be at a{' '}
            <span className="font-medium">{insights.skill_level.toLowerCase()}</span> level
            in internet marketing.
          </p>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
          <ul className="space-y-3">
            {insights.recommendations.map((recommendation: string, index: number) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-start"
              >
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{recommendation}</span>
              </motion.li>
            ))}
          </ul>
        </Card>
      </div>
    );
  };
  
  const renderRecommendationContent = () => {
    switch (recommendation_type) {
      case 'product_purchase':
        return renderProductPurchaseRecommendation();
      case 'user_insights':
        return renderUserInsightsRecommendation();
      default:
        return <p>Unknown recommendation type</p>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-gray-100 mr-3">
            {recommendation_type === 'product_purchase' ? (
              content.recommendation?.worth_buying ? 
                <ThumbsUp className="h-5 w-5 text-green-500" /> : 
                <ThumbsDown className="h-5 w-5 text-red-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-primary-500" />
            )}
          </div>
          
          <Badge 
            variant={recommendation_type === 'product_purchase' ? 'primary' : 'secondary'}
            size="md"
          >
            {recommendation_type.replace('_', ' ')}
          </Badge>
          
          <div className="flex items-center text-gray-600 ml-4">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(created_at)}
          </div>
        </div>
        
        {!is_read && onMarkAsRead && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<CheckCircle className="h-4 w-4" />}
            onClick={onMarkAsRead}
          >
            Mark as read
          </Button>
        )}
      </div>
      
      {renderRecommendationContent()}
    </div>
  );
};

export default RecommendationDetail;
