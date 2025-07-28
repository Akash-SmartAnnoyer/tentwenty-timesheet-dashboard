'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: 'Invalid email or password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Top blue border */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-10"></div>
      
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center lg:justify-start relative px-6 py-8 lg:py-0">
        <div className="w-full max-w-md lg:max-w-none lg:pl-20">
          <h1 
            className="mb-8 text-center lg:text-left"
            style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontStyle: 'Bold',
              fontSize: '20px',
              lineHeight: '125%',
              letterSpacing: '0%',
              color: '#111928'
            }}
          >
            Welcome back
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="name@example.com"
                style={{
                  width: '100%',
                  maxWidth: '576px',
                  height: '42px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  padding: '3px 4px',
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontStyle: 'Regular',
                  fontSize: '14px',
                  lineHeight: '125%',
                  letterSpacing: '0%',
                  verticalAlign: 'middle',
                  color: '#111928',
                  outline: 'none'
                }}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  maxWidth: '576px',
                  height: '42px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  padding: '3px 4px',
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontStyle: 'Regular',
                  fontSize: '14px',
                  lineHeight: '125%',
                  letterSpacing: '0%',
                  verticalAlign: 'middle',
                  color: '#111928',
                  outline: 'none'
                }}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) => handleChange('rememberMe', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {errors.general && (
              <p className="text-red-500 text-sm">{errors.general}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                maxWidth: '576px',
                height: '41px',
                borderRadius: '8px',
                gap: '8px',
                padding: '2.5px 5px',
                background: '#1A56DB',
                color: '#fff',
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '150%',
                letterSpacing: '0%',
                border: 'none',
                cursor: 'pointer',
                opacity: isSubmitting ? 0.5 : 1
              }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
        
        {/* Copyright Footer */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <p className="text-gray-500 text-sm">© 2024 tentwenty</p>
        </div>
      </div>

      {/* Right Panel - Promotional Content */}
      <div className="w-full lg:w-1/2 bg-blue-600 flex items-center justify-center px-6 py-12 lg:px-12 lg:py-0">
        <div 
          className="text-white text-center lg:text-left"
          style={{
            width: '100%',
            maxWidth: '576px',
            minHeight: '168px',
            gap: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h2 
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 'clamp(24px, 5vw, 40px)',
              lineHeight: '150%',
              letterSpacing: '0%',
              verticalAlign: 'middle',
              color: '#ffffff',
              margin: 0
            }}
          >
            ticktock
          </h2>
          <p 
            style={{
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: 'clamp(14px, 3vw, 16px)',
              lineHeight: '150%',
              letterSpacing: '0%',
              color: '#ffffff',
              margin: 0
            }}
          >
            Introducing ticktock, our cutting-edge timesheet web application designed to revolutionize how you manage employee work hours. With ticktock, you can effortlessly track and monitor employee attendance and productivity from anywhere, anytime, using any internet-connected device.
          </p>
        </div>
      </div>
    </div>
  );
} 