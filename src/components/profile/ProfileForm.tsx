import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserProfile, UserGoal } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { USER_GOALS } from '../../lib/constants';
import { DollarSign, Target, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface ProfileFormProps {
  profile: UserProfile;
  onSubmit: (data: Partial<UserProfile>) => Promise<void>;
}

interface FormData {
  full_name: string;
  budget: number;
  selectedGoals: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSubmit,
}) => {
  const { isLoading } = useAuthStore();
  const [selectedGoals, setSelectedGoals] = useState<UserGoal[]>(
    profile.goals as UserGoal[] || []
  );
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      full_name: profile.full_name || '',
      budget: profile.budget || 1000,
      selectedGoals: '',
    },
  });

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as UserGoal;
    if (!selectedGoals.includes(value)) {
      setSelectedGoals([...selectedGoals, value]);
    }
  };

  const removeGoal = (goal: UserGoal) => {
    setSelectedGoals(selectedGoals.filter(g => g !== goal));
  };

  const processSubmit = async (data: FormData) => {
    await onSubmit({
      full_name: data.full_name,
      budget: data.budget,
      goals: selectedGoals,
    });
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
      <Input
        label="Full Name"
        placeholder="John Doe"
        leftIcon={<User className="h-5 w-5" />}
        {...register('full_name', { 
          required: 'Full name is required',
        })}
        error={errors.full_name?.message}
        fullWidth
      />
      
      <Input
        label="Monthly Budget ($)"
        type="number"
        step="0.01"
        min="0"
        placeholder="1000"
        leftIcon={<DollarSign className="h-5 w-5" />}
        {...register('budget', { 
          required: 'Budget is required',
          valueAsNumber: true,
          min: {
            value: 0,
            message: 'Budget must be greater than or equal to 0'
          }
        })}
        error={errors.budget?.message}
        helperText="Your monthly budget for marketing products"
        fullWidth
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Marketing Goals
        </label>
        
        <div className="flex items-center mb-2">
          <Select
            options={USER_GOALS.map(goal => ({ value: goal.value, label: goal.label }))}
            onChange={handleGoalChange}
            fullWidth
          />
        </div>
        
        {selectedGoals.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedGoals.map(goal => {
              const goalInfo = USER_GOALS.find(g => g.value === goal);
              return (
                <div 
                  key={goal}
                  className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full flex items-center"
                >
                  <Target className="h-4 w-4 mr-1" />
                  {goalInfo?.label || goal}
                  <button
                    type="button"
                    className="ml-2 text-primary-600 hover:text-primary-800"
                    onClick={() => removeGoal(goal)}
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Save Profile
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
