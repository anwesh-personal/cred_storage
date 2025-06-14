import React, { useEffect, useRef } from 'react';
import { Product } from '../../types';
import * as d3 from 'd3';
import { Card } from '../ui';

interface ProductMindMapProps {
  product: Product;
  relatedProducts: Product[];
}

interface Node {
  id: string;
  name: string;
  type: 'product' | 'feature' | 'category' | 'related';
  value?: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

const ProductMindMap: React.FC<ProductMindMapProps> = ({ product, relatedProducts }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Generate nodes and links
    const nodes: Node[] = [
      { id: product.id, name: product.name, type: 'product' }
    ];
    
    const links: Link[] = [];
    
    // Add category
    if (product.category) {
      const categoryId = `category-${product.category}`;
      nodes.push({ id: categoryId, name: product.category, type: 'category' });
      links.push({ source: product.id, target: categoryId, value: 3 });
    }
    
    // Add features
    if (product.features) {
      Object.entries(product.features).forEach(([key, value], index) => {
        const featureId = `feature-${index}`;
        nodes.push({ 
          id: featureId, 
          name: `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 
          type: 'feature',
          value: typeof value === 'number' ? value : 1
        });
        links.push({ source: product.id, target: featureId, value: 2 });
      });
    } else {
      // Add mock features if none exist
      const mockFeatures = [
        'User-friendly interface',
        'Integration capabilities',
        'Analytics dashboard',
        'Automation tools',
        'Customer support'
      ];
      
      mockFeatures.forEach((feature, index) => {
        const featureId = `feature-${index}`;
        nodes.push({ id: featureId, name: feature, type: 'feature' });
        links.push({ source: product.id, target: featureId, value: 2 });
      });
    }
    
    // Add related products
    relatedProducts.forEach(relatedProduct => {
      nodes.push({ id: relatedProduct.id, name: relatedProduct.name, type: 'related' });
      links.push({ source: product.id, target: relatedProduct.id, value: 1 });
    });
    
    // Set up the SVG
    const width = svgRef.current.clientWidth;
    const height = 500;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    // Create a force simulation
    const simulation = d3.forceSimulation<any>(nodes)
      .force('link', d3.forceLink<any, any>(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));
    
    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => Math.sqrt(d.value));
    
    // Create node groups
    const node = svg.append('g')
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    
    // Add circles to nodes
    node.append('circle')
      .attr('r', (d) => {
        if (d.type === 'product') return 30;
        if (d.type === 'category') return 25;
        if (d.type === 'related') return 20;
        return 15;
      })
      .attr('fill', (d) => {
        if (d.type === 'product') return '#8884d8';
        if (d.type === 'category') return '#82ca9d';
        if (d.type === 'related') return '#ffc658';
        return '#ff8042';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);
    
    // Add labels to nodes
    node.append('text')
      .attr('dx', (d) => {
        if (d.type === 'product') return 35;
        if (d.type === 'category') return 30;
        return 20;
      })
      .attr('dy', '.35em')
      .attr('font-size', (d) => {
        if (d.type === 'product') return '14px';
        return '12px';
      })
      .attr('font-weight', (d) => {
        if (d.type === 'product') return 'bold';
        return 'normal';
      })
      .text((d) => d.name);
    
    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      
      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });
    
    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [product, relatedProducts]);
  
  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="text-lg font-medium text-gray-900">Product Mind Map</h3>
        <p className="text-sm text-gray-500">
          Visualize how this product relates to features, categories, and other products
        </p>
      </div>
      <div className="p-4">
        <div className="bg-white rounded-lg overflow-hidden">
          <svg ref={svgRef} width="100%" height="500" />
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#8884d8] mr-2"></div>
            <span className="text-sm text-gray-600">Current Product</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#82ca9d] mr-2"></div>
            <span className="text-sm text-gray-600">Category</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#ffc658] mr-2"></div>
            <span className="text-sm text-gray-600">Related Products</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#ff8042] mr-2"></div>
            <span className="text-sm text-gray-600">Features</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductMindMap;
