export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string;
  url: string;
  price: number;
  category: string;
  purchase_date: string;
  created_at: string;
  features?: Record<string, any>;
}

export interface ProductRecommendationRequest {
  product_id: string;
  user_id: string;
  goals: string[];
  budget: number;
  existing_products: string[];
}

export interface AIRecommendation {
  id: string;
  product_id: string;
  user_id: string;
  recommendation: string;
  worth_buying: boolean;
  goal_alignment: {
    alignment_score: number;
    aligned_goals: string[];
    misaligned_goals: string[];
  };
  budget_analysis: {
    within_budget: boolean;
    budget_impact: string;
  };
  similarity_to_existing: {
    has_similar: boolean;
    similar_products: Array<{
      id: string;
      name: string;
      similarity_score: number;
    }>;
  };
  alternative_suggestions: Array<{
    name: string;
    url?: string;
    reason: string;
  }>;
  created_at: string;
}
