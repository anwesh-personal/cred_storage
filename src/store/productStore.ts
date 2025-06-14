import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Product, ProductAnalysisResult } from '../types';
import { analyzeProduct, extractProductFeatures } from '../lib/ai';
import toast from 'react-hot-toast';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  
  fetchProducts: (userId: string) => Promise<void>;
  addProduct: (productData: Partial<Product>, userId: string) => Promise<string | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  analyzeProductWithAI: (product: Partial<Product>) => Promise<ProductAnalysisResult>;
  extractFeaturesFromUrl: (url: string, description: string) => Promise<Record<string, any>>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  
  fetchProducts: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .order('purchase_date', { ascending: false });
      
      if (error) throw error;
      
      set({ products: data || [], isLoading: false });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to fetch products' 
      });
    }
  },
  
  addProduct: async (productData, userId) => {
    try {
      set({ isLoading: true, error: null });
      
      // Extract features if not provided
      let features = productData.features;
      if (!features && productData.description) {
        features = await extractProductFeatures(
          productData.url || '', 
          productData.description
        );
      }
      
      // Analyze with AI
      const aiAnalysis = await analyzeProduct({
        ...productData,
        features
      });
      
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          user_id: userId,
          features: features || {},
          ai_analysis: aiAnalysis,
          tags: aiAnalysis.tags,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      set(state => ({
        products: [data, ...state.products],
        isLoading: false
      }));
      
      toast.success('Product added successfully!');
      return data.id;
    } catch (error: any) {
      console.error('Error adding product:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to add product' 
      });
      toast.error('Failed to add product');
      return null;
    }
  },
  
  updateProduct: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      set(state => ({
        products: state.products.map(product => 
          product.id === id ? { ...product, ...updates } : product
        ),
        isLoading: false
      }));
      
      toast.success('Product updated successfully!');
    } catch (error: any) {
      console.error('Error updating product:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to update product' 
      });
      toast.error('Failed to update product');
    }
  },
  
  deleteProduct: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      set(state => ({
        products: state.products.filter(product => product.id !== id),
        isLoading: false
      }));
      
      toast.success('Product deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to delete product' 
      });
      toast.error('Failed to delete product');
    }
  },
  
  analyzeProductWithAI: async (product) => {
    try {
      set({ isLoading: true, error: null });
      const result = await analyzeProduct(product);
      set({ isLoading: false });
      return result;
    } catch (error: any) {
      console.error('Error analyzing product with AI:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to analyze product' 
      });
      return {
        summary: "Analysis failed",
        key_features: [],
        pros: [],
        cons: ["Analysis failed due to an error"],
        recommendation_score: 0,
        tags: []
      };
    }
  },
  
  extractFeaturesFromUrl: async (url, description) => {
    try {
      set({ isLoading: true, error: null });
      const features = await extractProductFeatures(url, description);
      set({ isLoading: false });
      return features;
    } catch (error: any) {
      console.error('Error extracting features:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to extract features' 
      });
      return {};
    }
  }
}));
