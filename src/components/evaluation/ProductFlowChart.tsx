import React, { useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Product } from '../../types';
import { Card, Button } from '../ui';

interface ProductFlowChartProps {
  product: Product;
}

const ProductFlowChart: React.FC<ProductFlowChartProps> = ({ product }) => {
  const [flowType, setFlowType] = useState<'workflow' | 'integration' | 'roi'>('workflow');
  
  // Generate workflow nodes and edges
  const generateWorkflowElements = () => {
    const nodes: Node[] = [
      {
        id: '1',
        data: { label: 'Start Marketing Campaign' },
        position: { x: 250, y: 0 },
        style: { background: '#D6E4FF', border: '1px solid #3B82F6', borderRadius: '8px', width: 180 }
      },
      {
        id: '2',
        data: { label: `Use ${product.name}` },
        position: { x: 250, y: 100 },
        style: { background: '#8884d8', color: 'white', border: '1px solid #6B46C1', borderRadius: '8px', width: 180 }
      },
      {
        id: '3',
        data: { label: 'Create Content' },
        position: { x: 100, y: 200 },
        style: { background: '#D1FAE5', border: '1px solid #10B981', borderRadius: '8px', width: 150 }
      },
      {
        id: '4',
        data: { label: 'Set Up Automation' },
        position: { x: 400, y: 200 },
        style: { background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '8px', width: 150 }
      },
      {
        id: '5',
        data: { label: 'Analyze Results' },
        position: { x: 250, y: 300 },
        style: { background: '#DBEAFE', border: '1px solid #3B82F6', borderRadius: '8px', width: 150 }
      },
      {
        id: '6',
        data: { label: 'Optimize Campaign' },
        position: { x: 250, y: 400 },
        style: { background: '#E0E7FF', border: '1px solid #6366F1', borderRadius: '8px', width: 150 }
      }
    ];
    
    const edges: Edge[] = [
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e3-5', source: '3', target: '5' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e6-2', source: '6', target: '2', type: 'step', style: { strokeDasharray: '5,5' } }
    ];
    
    return { nodes, edges };
  };
  
  // Generate integration nodes and edges
  const generateIntegrationElements = () => {
    const nodes: Node[] = [
      {
        id: 'center',
        data: { label: product.name },
        position: { x: 250, y: 250 },
        style: { background: '#8884d8', color: 'white', border: '1px solid #6B46C1', borderRadius: '8px', width: 150 }
      },
      {
        id: 'crm',
        data: { label: 'CRM System' },
        position: { x: 250, y: 100 },
        style: { background: '#DBEAFE', border: '1px solid #3B82F6', borderRadius: '8px', width: 150 }
      },
      {
        id: 'email',
        data: { label: 'Email Marketing' },
        position: { x: 450, y: 175 },
        style: { background: '#D1FAE5', border: '1px solid #10B981', borderRadius: '8px', width: 150 }
      },
      {
        id: 'analytics',
        data: { label: 'Analytics Platform' },
        position: { x: 450, y: 325 },
        style: { background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '8px', width: 150 }
      },
      {
        id: 'social',
        data: { label: 'Social Media' },
        position: { x: 250, y: 400 },
        style: { background: '#FCE7F3', border: '1px solid #EC4899', borderRadius: '8px', width: 150 }
      },
      {
        id: 'website',
        data: { label: 'Website/CMS' },
        position: { x: 50, y: 325 },
        style: { background: '#E0E7FF', border: '1px solid #6366F1', borderRadius: '8px', width: 150 }
      },
      {
        id: 'ads',
        data: { label: 'Ad Platforms' },
        position: { x: 50, y: 175 },
        style: { background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '8px', width: 150 }
      }
    ];
    
    const edges: Edge[] = [
      { id: 'e-center-crm', source: 'center', target: 'crm', animated: true, type: 'smoothstep' },
      { id: 'e-center-email', source: 'center', target: 'email', animated: true, type: 'smoothstep' },
      { id: 'e-center-analytics', source: 'center', target: 'analytics', animated: true, type: 'smoothstep' },
      { id: 'e-center-social', source: 'center', target: 'social', animated: true, type: 'smoothstep' },
      { id: 'e-center-website', source: 'center', target: 'website', animated: true, type: 'smoothstep' },
      { id: 'e-center-ads', source: 'center', target: 'ads', animated: true, type: 'smoothstep' }
    ];
    
    return { nodes, edges };
  };
  
  // Generate ROI flow nodes and edges
  const generateRoiElements = () => {
    const nodes: Node[] = [
      {
        id: 'investment',
        data: { label: `Investment: $${product.price}/mo` },
        position: { x: 250, y: 50 },
        style: { background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '8px', width: 180 }
      },
      {
        id: 'product',
        data: { label: product.name },
        position: { x: 250, y: 150 },
        style: { background: '#8884d8', color: 'white', border: '1px solid #6B46C1', borderRadius: '8px', width: 180 }
      },
      {
        id: 'time',
        data: { label: 'Time Saved: 15h/mo' },
        position: { x: 100, y: 250 },
        style: { background: '#D1FAE5', border: '1px solid #10B981', borderRadius: '8px', width: 150 }
      },
      {
        id: 'efficiency',
        data: { label: 'Efficiency: +35%' },
        position: { x: 400, y: 250 },
        style: { background: '#DBEAFE', border: '1px solid #3B82F6', borderRadius: '8px', width: 150 }
      },
      {
        id: 'revenue',
        data: { label: 'Revenue Increase' },
        position: { x: 250, y: 350 },
        style: { background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '8px', width: 150 }
      },
      {
        id: 'roi',
        data: { label: 'ROI: 320%' },
        position: { x: 250, y: 450 },
        style: { background: '#D1FAE5', border: '1px solid #10B981', borderRadius: '8px', width: 150, fontWeight: 'bold' }
      }
    ];
    
    const edges: Edge[] = [
      { id: 'e-inv-prod', source: 'investment', target: 'product', animated: true },
      { id: 'e-prod-time', source: 'product', target: 'time' },
      { id: 'e-prod-eff', source: 'product', target: 'efficiency' },
      { id: 'e-time-rev', source: 'time', target: 'revenue', type: 'smoothstep' },
      { id: 'e-eff-rev', source: 'efficiency', target: 'revenue', type: 'smoothstep' },
      { id: 'e-rev-roi', source: 'revenue', target: 'roi', animated: true }
    ];
    
    return { nodes, edges };
  };
  
  let elements;
  
  switch (flowType) {
    case 'workflow':
      elements = generateWorkflowElements();
      break;
    case 'integration':
      elements = generateIntegrationElements();
      break;
    case 'roi':
      elements = generateRoiElements();
      break;
    default:
      elements = generateWorkflowElements();
  }
  
  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="text-lg font-medium text-gray-900">Product Flow Analysis</h3>
        <p className="text-sm text-gray-500">
          Visualize workflows, integrations, and ROI for {product.name}
        </p>
        
        <div className="mt-3 flex space-x-2">
          <Button
            variant={flowType === 'workflow' ? 'primary' : 'outline'}
            onClick={() => setFlowType('workflow')}
          >
            Workflow
          </Button>
          <Button
            variant={flowType === 'integration' ? 'primary' : 'outline'}
            onClick={() => setFlowType('integration')}
          >
            Integrations
          </Button>
          <Button
            variant={flowType === 'roi' ? 'primary' : 'outline'}
            onClick={() => setFlowType('roi')}
          >
            ROI Analysis
          </Button>
        </div>
      </div>
      
      <div style={{ height: 500 }}>
        <ReactFlow
          nodes={elements.nodes}
          edges={elements.edges}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </Card>
  );
};

export default ProductFlowChart;
