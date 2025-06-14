import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import ProfileForm from '../components/profile/ProfileForm';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { UserProfile } from '../types';

const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (data: Partial<UserProfile>) => {
    await updateProfile(data);
    navigate('/dashboard');
  };

  if (isLoading || !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          Back to Dashboard
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your personal information and preferences
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <ProfileForm 
            profile={profile}
            onSubmit={handleSubmit}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
