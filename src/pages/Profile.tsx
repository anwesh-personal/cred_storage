import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { Card, Button } from '../components/ui';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData.user) {
          setUser({
            id: userData.user.id,
            email: userData.user.email || '',
            created_at: userData.user.created_at || new Date().toISOString()
          });
          setNewEmail(userData.user.email || '');
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getProfile();
  }, []);

  const updateProfile = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      setUpdating(true);
      
      if (newEmail !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: newEmail,
        });
        
        if (emailError) throw emailError;
        toast.success('Email update initiated. Check your inbox for confirmation.');
      }
      
      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });
        
        if (passwordError) throw passwordError;
        toast.success('Password updated successfully');
        setNewPassword('');
        setConfirmPassword('');
      }
      
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Account Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Update your account settings and change your password.
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <dl className="divide-y divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.id}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">New password</dt>
                  <dd className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter new password"
                    />
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Confirm password</dt>
                  <dd className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Confirm new password"
                    />
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Account created</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(user?.created_at || '').toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={updateProfile}
                isLoading={updating}
              >
                Update Profile
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
