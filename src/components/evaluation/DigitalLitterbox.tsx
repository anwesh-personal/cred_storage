import React, { useState } from 'react';
import { Product } from '../../types';
import { Card, Button } from '../ui';
import { motion } from 'framer-motion';
import { Trash2, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface DigitalLitterboxProps {
  product: Product;
}

interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  score: number | null;
}

const DigitalLitterbox: React.FC<DigitalLitterboxProps> = ({ product }) => {
  const [criteria, setCriteria] = useState<EvaluationCriteria[]>([
    {
      id: 'usage',
      name: 'Usage Frequency',
      description: 'How often do you actually use this product?',
      score: null
    },
    {
      id: 'roi',
      name: 'Return on Investment',
      description: 'Is this product providing value for its cost?',
      score: null
    },
    {
      id: 'alternatives',
      name: 'Better Alternatives',
      description: 'Are there better alternatives available now?',
      score: null
    },
    {
      id: 'relevance',
      name: 'Current Relevance',
      description: 'Is this product still relevant to your business goals?',
      score: null
    },
    {
      id: 'integration',
      name: 'Integration Quality',
      description: 'How well does it integrate with your other tools?',
      score: null
    }
  ]);
  
  const [notes, setNotes] = useState('');
  const [decision, setDecision] = useState<'keep' | 'remove' | 'undecided'>('undecided');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const handleScoreChange = (id: string, score: number) => {
    setCriteria(criteria.map(c => 
      c.id === id ? { ...c, score } : c
    ));
  };
  
  const getAverageScore = () => {
    const scoredCriteria = criteria.filter(c => c.score !== null);
    if (scoredCriteria.length === 0) return 0;
    
    const sum = scoredCriteria.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return sum / scoredCriteria.length;
  };
  
  const getRecommendation = () => {
    const avgScore = getAverageScore();
    
    if (avgScore >= 7) {
      return {
        decision: 'keep',
        message: `${product.name} is still valuable to your marketing stack. Keep it and continue to maximize its use.`
      };
    } else if (avgScore >= 4) {
      return {
        decision: 'review',
        message: `${product.name} provides some value but may need reevaluation. Consider if you're using it to its full potential.`
      };
    } else {
      return {
        decision: 'remove',
        message: `${product.name} doesn't seem to be providing sufficient value. Consider replacing it or canceling your subscription.`
      };
    }
  };
  
  const allCriteriaScored = criteria.every(c => c.score !== null);
  const recommendation = getRecommendation();
  
  const handleMakeDecision = (choice: 'keep' | 'remove') => {
    setDecision(choice);
    setShowConfirmation(true);
  };
  
  const handleConfirmDecision = () => {
    // In a real app, this would update the database
    // For now, just close the confirmation dialog
    setShowConfirmation(false);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Digital Litterbox Evaluation</h3>
        <p className="text-gray-600 mb-6">
          Evaluate whether {product.name} is still providing value or if it should be removed from your digital shelf.
        </p>
        
        <div className="space-y-6">
          {criteria.map((criterion) => (
            <div key={criterion.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{criterion.name}</h4>
                  <p className="text-sm text-gray-500">{criterion.description}</p>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {criterion.score !== null ? `${criterion.score}/10` : 'Not rated'}
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <button
                    key={score}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      criterion.score === score
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleScoreChange(criterion.id, score)}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Add any additional thoughts about this product..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </Card>
      
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluation Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Average Score</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              {getAverageScore().toFixed(1)}/10
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Monthly Cost</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              ${product.price.toFixed(2)}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-500">Annual Cost</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              ${(product.price * 12).toFixed(2)}
            </div>
          </div>
        </div>
        
        {allCriteriaScored && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 p-4 rounded-lg mb-6"
          >
            <div className="flex items-start">
              {recommendation.decision === 'keep' && (
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              )}
              {recommendation.decision === 'review' && (
                <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0" />
              )}
              {recommendation.decision === 'remove' && (
                <XCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {recommendation.decision === 'keep' && 'Keep This Product'}
                  {recommendation.decision === 'review' && 'Review Usage'}
                  {recommendation.decision === 'remove' && 'Consider Removing'}
                </h3>
                <p className="text-gray-600">{recommendation.message}</p>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => handleMakeDecision('keep')}
            disabled={!allCriteriaScored}
          >
            <RefreshCw size={16} className="mr-2" />
            Keep Product
          </Button>
          <Button
            variant="danger"
            onClick={() => handleMakeDecision('remove')}
            disabled={!allCriteriaScored}
          >
            <Trash2 size={16} className="mr-2" />
            Remove Product
          </Button>
        </div>
      </Card>
      
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {decision === 'keep' ? 'Keep This Product?' : 'Remove This Product?'}
              </h3>
              <p className="text-gray-600 mb-4">
                {decision === 'keep'
                  ? `You've decided to keep ${product.name} in your marketing stack. This will be noted in your product history.`
                  : `You've decided to remove ${product.name} from your marketing stack. This won't delete the product from your history, but will mark it as inactive.`}
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant={decision === 'keep' ? 'primary' : 'danger'}
                  onClick={handleConfirmDecision}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DigitalLitterbox;
