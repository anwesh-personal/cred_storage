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
  features: Record<string, any>;
  created_at?: string;
}

export interface AIRecommendation {
  id: string;
  user_id: string;
  recommendation_type: string;
  content: string;
  score: number;
  created_at?: string;
}
