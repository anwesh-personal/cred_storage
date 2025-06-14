import React from 'react';
import { UserProfile } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Target, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

interface UserInsightsSummaryProps {
  profile: UserProfile;
  onGenerateInsights: () => Promise<void>;
  isLoading: boolean;
}

const UserInsightsSummary: React.FC<UserInsightsSummaryProps> = ({
  profile,
  onGenerateInsights,
  isLoading,
}) => {
  const { ai_insights: insights } = profile;

  if (!insights) {
    return (
      <Card className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
        <p className="text-gray-600 mb-4">
          Generate AI insights based on your product purchase history to understand your marketing profile.
        </p>
        <Button
          onClick={onGenerateInsights}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Generate Insights
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Your Marketing Profile</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onGenerateInsights}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Refresh Insights
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Primary Goal</h4>
          <div className="flex items-center">
            <Target className="h-5 w-5 text-primary-500 mr-2" />
            <span className="text-lg font-semibold text-gray-900">
              {insights.primary_goal}
            </span>
          </div>
        </Card>
        
        <Card>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Skill Level</h4>
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-secondary-500 mr-2" />
            <span className="text-lg font-semibold text-gray-900">
              {insights.skill_level}
            </span>
          </div>
        </Card>
        
        <Card>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Spending Pattern</h4>
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-lg font-semibold text-gray-900">
              {Array.isArray(insights.spending_patterns) && insights.spending_patterns.length > 0
                ? insights.spending_patterns[0]
                : 'Not enough data'}
            </span>
          </div>
        </Card>
      </div>
      
      <Card>
        <h4 className="text-sm font-medium text-gray-500 mb-2">Interest Areas</h4>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(insights.interest_areas) && insights.interest_areas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Badge variant="secondary" size="md">
                {area}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>
      
      <Card>
        <h4 className="text-sm font-medium text-gray-500 mb-2">Top Recommendation</h4>
        {Array.isArray(insights.recommendations) && insights.recommendations.length > 0 ? (
          <p className="text-gray-700">{insights.recommendations[0]}</p>
        ) : (
          <p className="text-gray-500">No recommendations available</p>
        )}
      </Card>
    </div>
  );
};

export default UserInsightsSummary;
