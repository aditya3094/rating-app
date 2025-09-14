import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Eye, EyeOff, User, Mail, Lock, MapPin, UserPlus } from 'lucide-react';
import { authAPI } from '../api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Name validation (20-60 chars)
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Name must be between 20 and 60 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation (8-16 chars, 1 uppercase, 1 special char)
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = 'Password must be between 8 and 16 characters';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 uppercase letter';
    } else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 special character';
    }

    // Address validation (max 400 chars)
    if (!formData.address) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length > 400) {
      newErrors.address = 'Address must not exceed 400 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await authAPI.signup(formData);
      navigate('/login', { 
        state: { message: 'Account created successfully! Please log in.' }
      });
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <Card className="w-full max-w-md p-8 animate-slide-up">
        <div className="text-center mb-8">
          <div className="gradient-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-2">
            Join our rating community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name *
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="pl-10"
                placeholder="Enter your full name (20-60 chars)"
              />
            </div>
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium">
              Password *
            </Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10"
                placeholder="8-16 chars, 1 uppercase, 1 special"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div>
            <Label htmlFor="address" className="text-sm font-medium">
              Address *
            </Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="pl-10 resize-none"
                rows={3}
                placeholder="Enter your address (max 400 chars)"
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              {errors.address && <p className="form-error">{errors.address}</p>}
              <span className="text-xs text-muted-foreground ml-auto">
                {formData.address.length}/400
              </span>
            </div>
          </div>

          {errors.submit && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Signup;