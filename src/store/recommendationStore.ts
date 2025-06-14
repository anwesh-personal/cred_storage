import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AIRecommendation, ProductRecommendationRequest } from '../types';

interface RecommendationState {
  isLoading: boolean;
  error: string | null;
  recommendation: AIRecommendation | null;
  requestRecommendation: (request: ProductRecommendationRequest) => Promise<AIRecommendation | null>;
}

export const useRecommendationStore = create<RecommendationState>((set, get) => ({
  isLoading: false,
  error: null,
  recommendation: null,
  
  requestRecommendation: async (request: ProductRecommendationRequest) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would call an API endpoint that would process the request
      // and generate a recommendation using AI. For demo purposes, we'll simulate this
      // with a mock response after a short delay.
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock recommendation data
      const mockRecommendation: AIRecommendation = {
        id: 'rec_' + Math.random().toString(36).substr(2, 9),
        product_id: request.product_id,
        user_id: request.user_id,
        recommendation: "Based on your goals and budget, this product seems like a good fit. It aligns well with your content creation and automation goals, though it may not fully address your analytics needs.",
        worth_buying: Math.random() > 0.3, // 70% chance of recommending
        goal_alignment: {
          alignment_score: Math.random() * 0.6 + 0.4, // Score between 0.4 and 1.0
          aligned_goals: request.goals.filter(() => Math.random() > 0.3),
          misaligned_goals: request.goals.filter(() => Math.random() < 0.3),
        },
        budget_analysis: {
          within_budget: Math.random() > 0.2,
          budget_impact: "This product fits within your monthly budget and provides good value for the features offered.",
        },
        similarity_to_existing: {
          has_similar: Math.random() > 0.7,
          similar_products: request.existing_products.length > 0 && Math.random() > 0.7 
            ? [
                {
                  id: request.existing_products[0],
                  name: "Similar Product",
                  similarity_score: Math.random() * 0.5 + 0.3, // Score between 0.3 and 0.8
                }
              ]
            : [],
        },
        alternative_suggestions: Math.random() > 0.5 
          ? [
              {
                name: "Alternative Product A",
                url: "https://example.com/alt-a",
                reason: "Offers similar features at a lower price point.",
              },
              {
                name: "Alternative Product B",
                url: "https://example.com/alt-b",
                reason: "More comprehensive solution but at a higher price point.",
              }
            ]
          : [],
        created_at: new Date().toISOString(),
      };
      
      // In a real app, we would save this to the database
      // const { data, error } = await supabase
      //   .from('ai_recommendations')
      //   .insert(mockRecommendation)
      //   .select()
      //   .single();
      
      // if (error) throw error;
      
      set({ recommendation: mockRecommendation, isLoading: false });
      return mockRecommendation;
      
    } catch (error) {
      console.error('Error requesting recommendation:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      return null;
    }
  },
}));
