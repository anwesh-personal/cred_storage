import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import Badge from '../ui/Badge';
import { motion } from 'framer-motion';

interface RecentProductsListProps {
  products: Product[];
  limit?: number;
}

const RecentProductsList: React.FC<RecentProductsListProps> = ({
  products,
  limit = 5,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const displayProducts = products.slice(0, limit);

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {displayProducts.map((product, index) => (
          <motion.li
            key={product.id}
            className="py-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  <Link to={`/products/${product.id}`} className="hover:underline">
                    {product.name}
                  </Link>
                </p>
                <div className="flex items-center mt-1">
                  <Badge 
                    variant={product.category === 'course' ? 'primary' : product.category === 'software' ? 'secondary' : 'default'}
                    size="sm"
                  >
                    {product.category.replace('_', ' ')}
                  </Badge>
                  <span className="mx-2 text-gray-300">•</span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(product.purchase_date)}
                  </div>
                </div>
              </div>
              <div className="ml-4 flex flex-shrink-0 items-center space-x-4">
                <div className="font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </div>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
      
      {products.length > limit && (
        <div className="mt-4 text-center">
          <Link
            to="/products"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all products
          </Link>
        </div>
      )}
      
      {products.length === 0 && (
        <div className="py-6 text-center text-gray-500">
          <p>No products added yet</p>
          <Link
            to="/products/add"
            className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Add your first product
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentProductsList;
