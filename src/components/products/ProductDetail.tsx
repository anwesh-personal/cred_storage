import React from 'react';
import { Product } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Calendar, DollarSign, ExternalLink, Tag, Check, X, Star } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../ui/Button';
import { motion } from 'framer-motion';

interface ProductDetailProps {
  product: Product;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product,
  onEdit,
  onDelete
}) => {
  const { 
    name, 
    price, 
    purchase_date, 
    category, 
    description, 
    url, 
    features, 
    ai_analysis, 
    tags 
  } = product;
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const recommendationScore = ai_analysis?.recommendation_score || 0;
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const renderFeatures = () => {
    if (!features) return null;
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Features</h3>
        
        {Object.entries(features).map(([category, items]) => (
          <div key={category} className="mb-4">
            <h4 className="text-md font-medium mb-2 capitalize">{category.replace(/_/g, ' ')}</h4>
            
            {Array.isArray(items) ? (
              <ul className="list-disc pl-5 space-y-1">
                {items.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            ) : typeof items === 'object' ? (
              <div className="pl-5">
                {Object.entries(items as Record<string, any>).map(([key, value]) => (
                  <div key={key} className="mb-1">
                    <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                    <span className="text-gray-700">{value.toString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="pl-5 text-gray-700">{items.toString()}</p>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  const renderAnalysis = () => {
    if (!ai_analysis) return null;
    
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">AI Analysis</h3>
          <div className="flex items-center">
            <span className="mr-2">Recommendation Score:</span>
            <span className={`font-bold text-lg ${getScoreColor(recommendationScore)}`}>
              {recommendationScore}/10
            </span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{ai_analysis.summary}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <Card className="bg-green-50 border-green-100">
            <h4 className="text-md font-medium mb-2 flex items-center text-green-800">
              <Check className="h-5 w-5 mr-2 text-green-600" />
              Pros
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {ai_analysis.pros.map((pro: string, index: number) => (
                <li key={index} className="text-gray-700">{pro}</li>
              ))}
            </ul>
          </Card>
          
          <Card className="bg-red-50 border-red-100">
            <h4 className="text-md font-medium mb-2 flex items-center text-red-800">
              <X className="h-5 w-5 mr-2 text-red-600" />
              Cons
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {ai_analysis.cons.map((con: string, index: number) => (
                <li key={index} className="text-gray-700">{con}</li>
              ))}
            </ul>
          </Card>
        </div>
        
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2 flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Key Features
          </h4>
          <ul className="list-disc pl-5 space-y-1">
            {ai_analysis.key_features.map((feature: string, index: number) => (
              <li key={index} className="text-gray-700">{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
          <div className="flex items-center mt-2">
            <Badge variant={category === 'course' ? 'primary' : category === 'software' ? 'secondary' : 'default'}>
              {category.replace('_', ' ')}
            </Badge>
            <span className="mx-2 text-gray-300">•</span>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(purchase_date)}
            </div>
            <span className="mx-2 text-gray-300">•</span>
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-4 w-4 mr-1" />
              ${price.toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" onClick={onDelete}>
              Delete
            </Button>
          )}
          <Button 
            as="a" 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            rightIcon={<ExternalLink className="h-4 w-4" />}
          >
            Visit Product
          </Button>
        </div>
      </div>
      
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Badge variant="primary" size="md">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            </motion.div>
          ))}
        </div>
      )}
      
      <Card>
        <h3 className="text-lg font-semibold mb-3">Description</h3>
        <p className="text-gray-700 whitespace-pre-line">{description}</p>
      </Card>
      
      {renderFeatures()}
      {renderAnalysis()}
    </div>
  );
};

export default ProductDetail;
