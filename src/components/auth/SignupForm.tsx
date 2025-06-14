import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Mail, Lock, User } from 'lucide-react';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

const SignupForm: React.FC = () => {
  const { signUp, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    await signUp(data.email, data.password, data.fullName);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <Input
        label="Full Name"
        placeholder="John Doe"
        leftIcon={<User className="h-5 w-5" />}
        {...register('fullName', { 
          required: 'Full name is required',
        })}
        error={errors.fullName?.message}
        fullWidth
      />
      
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        leftIcon={<Mail className="h-5 w-5" />}
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
        error={errors.email?.message}
        fullWidth
      />
      
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        leftIcon={<Lock className="h-5 w-5" />}
        {...register('password', { 
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters'
          }
        })}
        error={errors.password?.message}
        fullWidth
      />
      
      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        leftIcon={<Lock className="h-5 w-5" />}
        {...register('confirmPassword', { 
          required: 'Please confirm your password',
          validate: value => value === password || 'Passwords do not match'
        })}
        error={errors.confirmPassword?.message}
        fullWidth
      />
      
      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
        fullWidth
      >
        Create Account
      </Button>
    </form>
  );
};

export default SignupForm;
