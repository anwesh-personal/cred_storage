import { ProductCategoryOption, UserGoalOption } from '../types';
import { 
  BookOpen, 
  Code, 
  FileText, 
  Users, 
  User, 
  Package, 
  Briefcase, 
  FileCode, 
  Plugin, 
  MoreHorizontal,
  Briefcase as BriefcaseIcon,
  Rocket,
  DollarSign,
  Sunset,
  BookOpen as BookOpenIcon,
  Users as UsersIcon,
  ShoppingBag,
  FileText as FileTextIcon,
  Tag,
  HelpCircle
} from 'lucide-react';

export const PRODUCT_CATEGORIES: ProductCategoryOption[] = [
  {
    value: 'course',
    label: 'Course',
    description: 'Educational content with structured lessons',
    icon: 'BookOpen'
  },
  {
    value: 'software',
    label: 'Software',
    description: 'Applications, tools, or platforms',
    icon: 'Code'
  },
  {
    value: 'ebook',
    label: 'E-Book',
    description: 'Digital books or guides',
    icon: 'FileText'
  },
  {
    value: 'membership',
    label: 'Membership',
    description: 'Recurring access to content or community',
    icon: 'Users'
  },
  {
    value: 'coaching',
    label: 'Coaching',
    description: 'Personal guidance or mentorship',
    icon: 'User'
  },
  {
    value: 'physical_product',
    label: 'Physical Product',
    description: 'Tangible items shipped to customers',
    icon: 'Package'
  },
  {
    value: 'service',
    label: 'Service',
    description: 'Done-for-you work or assistance',
    icon: 'Briefcase'
  },
  {
    value: 'template',
    label: 'Template',
    description: 'Pre-designed files or frameworks',
    icon: 'FileCode'
  },
  {
    value: 'plugin',
    label: 'Plugin/Extension',
    description: 'Add-ons for existing platforms',
    icon: 'Plugin'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Other types of products',
    icon: 'MoreHorizontal'
  }
];

export const USER_GOALS: UserGoalOption[] = [
  {
    value: 'main_business',
    label: 'Main Business',
    description: 'Building or growing a primary business',
    icon: 'Briefcase'
  },
  {
    value: 'side_hustle',
    label: 'Side Hustle',
    description: 'Creating additional income streams',
    icon: 'Rocket'
  },
  {
    value: 'passive_income',
    label: 'Passive Income',
    description: 'Building automated income sources',
    icon: 'DollarSign'
  },
  {
    value: 'retirement_project',
    label: 'Retirement Project',
    description: 'Post-career ventures or hobbies',
    icon: 'Sunset'
  },
  {
    value: 'skill_development',
    label: 'Skill Development',
    description: 'Learning new marketing abilities',
    icon: 'BookOpen'
  },
  {
    value: 'audience_building',
    label: 'Audience Building',
    description: 'Growing followers or subscribers',
    icon: 'Users'
  },
  {
    value: 'e_commerce',
    label: 'E-Commerce',
    description: 'Selling products online',
    icon: 'ShoppingBag'
  },
  {
    value: 'content_creation',
    label: 'Content Creation',
    description: 'Producing blogs, videos, or podcasts',
    icon: 'FileText'
  },
  {
    value: 'affiliate_marketing',
    label: 'Affiliate Marketing',
    description: 'Earning commissions from promotions',
    icon: 'Tag'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Other marketing goals',
    icon: 'HelpCircle'
  }
];

export const getProductCategoryIcon = (category: string) => {
  const found = PRODUCT_CATEGORIES.find(c => c.value === category);
  return found ? found.icon : 'Package';
};

export const getGoalIcon = (goal: string) => {
  const found = USER_GOALS.find(g => g.value === goal);
  return found ? found.icon : 'Target';
};

export const ICON_MAP: Record<string, React.ComponentType> = {
  BookOpen,
  Code,
  FileText,
  Users,
  User,
  Package,
  Briefcase,
  FileCode,
  Plugin,
  MoreHorizontal,
  BriefcaseIcon,
  Rocket,
  DollarSign,
  Sunset,
  BookOpenIcon,
  UsersIcon,
  ShoppingBag,
  FileTextIcon,
  Tag,
  HelpCircle
};
