import { ProductRecommendationRequest, ProductRecommendationResponse } from '../types';

export async function getProductRecommendation(
  request: ProductRecommendationRequest
): Promise<ProductRecommendationResponse> {
  // This is a mock implementation that would be replaced with a real AI API call
  const { productName, productUrl, userBudget, userGoals, existingProducts } = request;
  
  // Check if there are similar products
  const similarProducts = existingProducts
    .filter(product => {
      // Simple similarity check based on category and name
      const sameCategoryProducts = product.category?.toLowerCase() === productName.toLowerCase();
      const nameOverlap = product.name.toLowerCase().includes(productName.toLowerCase()) || 
                          productName.toLowerCase().includes(product.name.toLowerCase());
      return sameCategoryProducts || nameOverlap;
    })
    .map(product => ({
      name: product.name,
      similarity_score: Math.random() * 0.5 + 0.5 // Random score between 0.5 and 1.0
    }));
  
  // Determine if it's within budget
  // For demo purposes, assume the product costs between $20 and $200
  const estimatedPrice = Math.floor(Math.random() * 180) + 20;
  const withinBudget = estimatedPrice <= userBudget;
  
  // Analyze goal alignment
  const allGoals = userGoals;
  const alignedGoals: string[] = [];
  const misalignedGoals: string[] = [];
  
  // Randomly assign goals as aligned or misaligned
  allGoals.forEach(goal => {
    if (Math.random() > 0.3) {
      alignedGoals.push(goal);
    } else {
      misalignedGoals.push(goal);
    }
  });
  
  // Calculate alignment score (0-10)
  const alignmentScore = alignedGoals.length > 0 
    ? (alignedGoals.length / allGoals.length) * 10 
    : 0;
  
  // Determine if it's worth buying
  const worthBuying = alignmentScore > 6 && withinBudget && similarProducts.length < 2;
  
  // Generate recommendation text
  let recommendation = '';
  
  if (worthBuying) {
    recommendation = `Based on our analysis, ${productName} appears to be a good investment for your marketing stack. `;
    
    if (alignedGoals.length > 0) {
      recommendation += `It aligns well with your goals of ${alignedGoals.join(', ')}. `;
    }
    
    if (withinBudget) {
      recommendation += `At an estimated price of $${estimatedPrice}, it fits within your budget of $${userBudget}. `;
    }
    
    if (similarProducts.length > 0) {
      recommendation += `However, note that you already have ${similarProducts.length} similar product(s): ${similarProducts.map(p => p.name).join(', ')}. Consider if this new tool offers unique features that your existing tools don't provide.`;
    } else {
      recommendation += `This tool fills a gap in your current marketing stack and should provide good value.`;
    }
  } else {
    recommendation = `We don't recommend purchasing ${productName} at this time. `;
    
    if (alignedGoals.length === 0) {
      recommendation += `It doesn't align well with any of your stated goals. `;
    } else if (misalignedGoals.length > alignedGoals.length) {
      recommendation += `It only partially aligns with your goals. `;
    }
    
    if (!withinBudget) {
      recommendation += `At an estimated price of $${estimatedPrice}, it exceeds your budget of $${userBudget}. `;
    }
    
    if (similarProducts.length > 0) {
      recommendation += `You already have similar tools: ${similarProducts.map(p => p.name).join(', ')}. Consider maximizing the use of these existing tools before investing in a new one.`;
    }
  }
  
  // Generate alternative suggestions
  const alternativeSuggestions = worthBuying ? [] : [
    {
      name: `Alternative to ${productName}`,
      url: `https://example.com/alternative-to-${productName.toLowerCase().replace(/\s+/g, '-')}`,
      reason: "More affordable option with similar features"
    },
    {
      name: "Free Open Source Alternative",
      url: "https://example.com/open-source-marketing-tools",
      reason: "No-cost option to try before investing"
    }
  ];
  
  return {
    recommendation,
    worth_buying: worthBuying,
    similarity_to_existing: {
      similar_products: similarProducts,
      has_similar: similarProducts.length > 0
    },
    budget_analysis: {
      within_budget: withinBudget,
      budget_impact: withinBudget 
        ? `Low impact (${Math.round((estimatedPrice / userBudget) * 100)}% of your budget)` 
        : `High impact (${Math.round((estimatedPrice / userBudget) * 100)}% of your budget)`
    },
    goal_alignment: {
      aligned_goals: alignedGoals,
      misaligned_goals: misalignedGoals,
      alignment_score: alignmentScore
    },
    alternative_suggestions: alternativeSuggestions
  };
}
