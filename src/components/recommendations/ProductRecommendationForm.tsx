import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Product, ProductRecommendationRequest } from '../../types';
import { Button, Card, Input, Select, Textarea } from '../ui';
import { useRecommendationStore } from '../../store/recommendationStore';
import { Target, DollarSign, Package } from 'lucide-react';

interface ProductRecommendationFormProps {
  products: Product[];
  onSubmit: (result: any) => void;
}

interface FormValues {
  goals: string[];
  budget: number;
  existing_products: string[];
  notes: string;
}

const ProductRecommendationForm: React.FC<ProductRecommendationFormProps> = ({ 
  products,
  onSubmit
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
  const { requestRecommendation, isLoading } = useRecommendationStore();
  
  const availableGoals = [
    'Increase website traffic',
    'Generate more leads',
    'Improve conversion rates',
    'Automate marketing tasks',
    'Better content creation',
    'Enhanced analytics',
    'Social media management',
    'Email marketing',
    'SEO improvement',
    'Customer retention'
  ];
  
  const handleGoalToggle = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };
  
  const onFormSubmit = async (data: FormValues) => {
    const mainProduct = products[0];
    
    const request: ProductRecommendationRequest = {
      product_id: mainProduct.id,
      user_id: mainProduct.user_id,
      goals: selectedGoals,
      budget: data.budget,
      existing_products: products.slice(1).map(p => p.id)
    };
    
    const result = await requestRecommendation(request);
    if (result) {
      onSubmit(result);
    }
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Target className="h-4 w-4 text-primary-500 mr-1" />
              Marketing Goals
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Select the goals you're trying to achieve with your marketing tools
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableGoals.map(goal => (
                <div 
                  key={goal}
                  className={`
                    px-3 py-2 rounded-md text-sm cursor-pointer transition-colors
                    ${selectedGoals.includes(goal) 
                      ? 'bg-primary-100 text-primary-800 border border-primary-300' 
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'}
                  `}
                  onClick={() => handleGoalToggle(goal)}
                >
                  {goal}
                </div>
              ))}
            </div>
            {selectedGoals.length === 0 && (
              <p className="text-sm text-red-500 mt-1">Please select at least one goal</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <DollarSign className="h-4 w-4 text-primary-500 mr-1" />
              Monthly Marketing Budget
            </label>
            <Input
              type="number"
              placeholder="Enter your monthly budget"
              {...register('budget', { 
                required: 'Budget is required',
                min: { value: 1, message: 'Budget must be at least $1' }
              })}
              error={errors.budget?.message}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Package className="h-4 w-4 text-primary-500 mr-1" />
              Additional Notes
            </label>
            <Textarea
              placeholder="Any specific requirements or concerns about this product..."
              rows={3}
              {...register('notes')}
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={selectedGoals.length === 0 || isLoading}
            >
              Get AI Recommendation
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default ProductRecommendationForm;
