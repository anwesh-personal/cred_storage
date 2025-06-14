import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { Card } from '../ui';
import { ExternalLink, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ${product.price}/mo
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
        
        <div className="mt-4 text-xs text-gray-500">
          Purchased: {new Date(product.purchase_date).toLocaleDateString()}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:text-primary-500 flex items-center"
          >
            Visit <ExternalLink size={14} className="ml-1" />
          </a>
          <div className="flex space-x-2">
            <Link
              to={`/products/${product.id}/evaluate`}
              className="text-sm font-medium text-secondary-600 hover:text-secondary-500 flex items-center"
            >
              <BarChart2 size={14} className="mr-1" /> Evaluate
            </Link>
            <Link
              to={`/products/${product.id}`}
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View Details
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
