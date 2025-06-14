import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Product } from '../../types';
import { Card, Button } from '../ui';

interface ProductEvaluationChartProps {
  product: Product;
}

const ProductEvaluationChart: React.FC<ProductEvaluationChartProps> = ({ product }) => {
  const [chartType, setChartType] = React.useState<'performance' | 'roi' | 'comparison'>('performance');
  
  // Generate mock performance data
  const generatePerformanceData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => {
      const baseValue = Math.floor(Math.random() * 50) + 50;
      return {
        month,
        leads: baseValue,
        conversions: Math.floor(baseValue * (Math.random() * 0.3 + 0.1)),
        revenue: Math.floor(baseValue * (Math.random() * 10 + 20)),
      };
    });
  };
  
  // Generate mock ROI data
  const generateRoiData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    let cumulativeCost = 0;
    let cumulativeValue = 0;
    
    return months.map(month => {
      cumulativeCost += product.price;
      const monthlyValue = Math.floor(product.price * (Math.random() * 3 + 1.5));
      cumulativeValue += monthlyValue;
      
      return {
        month,
        cost: product.price,
        value: monthlyValue,
        cumulativeCost,
        cumulativeValue,
        roi: ((cumulativeValue - cumulativeCost) / cumulativeCost * 100).toFixed(1)
      };
    });
  };
  
  // Generate mock comparison data
  const generateComparisonData = () => {
    const categories = ['Ease of Use', 'Features', 'Support', 'Value', 'Integration'];
    return categories.map(category => {
      return {
        category,
        [product.name]: Math.floor(Math.random() * 3) + 7,
        'Industry Avg': Math.floor(Math.random() * 4) + 5,
        'Competitors': Math.floor(Math.random() * 5) + 4,
      };
    });
  };
  
  const performanceData = React.useMemo(() => generatePerformanceData(), []);
  const roiData = React.useMemo(() => generateRoiData(), [product.price]);
  const comparisonData = React.useMemo(() => generateComparisonData(), [product.name]);
  
  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="text-lg font-medium text-gray-900">Product Performance Metrics</h3>
        <p className="text-sm text-gray-500">
          Analyze how {product.name} is performing over time
        </p>
        
        <div className="mt-3 flex space-x-2">
          <Button
            variant={chartType === 'performance' ? 'primary' : 'outline'}
            onClick={() => setChartType('performance')}
          >
            Performance
          </Button>
          <Button
            variant={chartType === 'roi' ? 'primary' : 'outline'}
            onClick={() => setChartType('roi')}
          >
            ROI
          </Button>
          <Button
            variant={chartType === 'comparison' ? 'primary' : 'outline'}
            onClick={() => setChartType('comparison')}
          >
            Comparison
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        {chartType === 'performance' && (
          <div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={performanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="leads" name="Leads Generated" fill="#8884d8" />
                <Bar yAxisId="left" dataKey="conversions" name="Conversions" fill="#82ca9d" />
                <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>This chart shows the performance metrics for {product.name} over the last 6 months, including leads generated, conversions, and revenue attributed to this tool.</p>
            </div>
          </div>
        )}
        
        {chartType === 'roi' && (
          <div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={roiData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="cumulativeCost" name="Cumulative Cost ($)" stroke="#ff8042" />
                <Line yAxisId="left" type="monotone" dataKey="cumulativeValue" name="Cumulative Value ($)" stroke="#8884d8" />
                <Line yAxisId="right" type="monotone" dataKey="roi" name="ROI (%)" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>This chart shows the return on investment (ROI) for {product.name} over time, comparing the cumulative cost against the value generated and calculating the percentage ROI.</p>
            </div>
          </div>
        )}
        
        {chartType === 'comparison' && (
          <div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={comparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Bar dataKey={product.name} fill="#8884d8" />
                <Bar dataKey="Industry Avg" fill="#82ca9d" />
                <Bar dataKey="Competitors" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>This chart compares {product.name} against industry averages and competitors across various categories on a scale of 1-10.</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductEvaluationChart;
