import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Product, ProductCategory } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import { PRODUCT_CATEGORIES } from '../../lib/constants';
import { Calendar, DollarSign, Link as LinkIcon, Package } from 'lucide-react';
import { useProductStore } from '../../store/productStore';

interface ProductFormProps {
  onSubmit: (data: Partial<Product>) => Promise<void>;
  initialData?: Partial<Product>;
  isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  initialData,
  isEdit = false,
}) => {
  const { isLoading, extractFeaturesFromUrl } = useProductStore();
  const [isExtracting, setIsExtracting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Partial<Product>>({
    defaultValues: initialData || {
      name: '',
      url: '',
      price: 0,
      purchase_date: new Date().toISOString().split('T')[0],
      category: 'course',
      description: '',
    },
  });

  const url = watch('url');
  const description = watch('description');

  const handleExtractFeatures = async () => {
    if (!url || !description) return;
    
    setIsExtracting(true);
    try {
      const features = await extractFeaturesFromUrl(url, description);
      setValue('features', features);
    } finally {
      setIsExtracting(false);
    }
  };

  const processSubmit = async (data: Partial<Product>) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Name"
          placeholder="Enter product name"
          leftIcon={<Package className="h-5 w-5" />}
          {...register('name', { required: 'Product name is required' })}
          error={errors.name?.message}
          fullWidth
        />
        
        <Input
          label="Product URL"
          placeholder="https://example.com/product"
          leftIcon={<LinkIcon className="h-5 w-5" />}
          {...register('url', { 
            required: 'Product URL is required',
            pattern: {
              value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
              message: 'Please enter a valid URL'
            }
          })}
          error={errors.url?.message}
          fullWidth
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Price ($)"
          type="number"
          step="0.01"
          min="0"
          placeholder="49.99"
          leftIcon={<DollarSign className="h-5 w-5" />}
          {...register('price', { 
            required: 'Price is required',
            valueAsNumber: true,
            min: {
              value: 0,
              message: 'Price must be greater than or equal to 0'
            }
          })}
          error={errors.price?.message}
          fullWidth
        />
        
        <Input
          label="Purchase Date"
          type="date"
          leftIcon={<Calendar className="h-5 w-5" />}
          {...register('purchase_date', { required: 'Purchase date is required' })}
          error={errors.purchase_date?.message}
          fullWidth
        />
      </div>
      
      <Select
        label="Category"
        options={PRODUCT_CATEGORIES.map(cat => ({ value: cat.value, label: cat.label }))}
        {...register('category', { required: 'Category is required' })}
        error={errors.category?.message}
        fullWidth
      />
      
      <Textarea
        label="Description"
        placeholder="Describe the product, its features, and what it promises..."
        {...register('description', { 
          required: 'Description is required',
          minLength: {
            value: 20,
            message: 'Description should be at least 20 characters'
          }
        })}
        error={errors.description?.message}
        rows={5}
        fullWidth
      />
      
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={handleExtractFeatures}
          isLoading={isExtracting}
          disabled={!url || !description || isExtracting}
        >
          Extract Features with AI
        </Button>
        
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isEdit ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
