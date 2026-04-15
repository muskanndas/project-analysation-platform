import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.forgotPassword(email);
      
      if (response.data.success) {
        setSuccess(true);
      }
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Failed to send OTP. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">OTP Sent Successfully</h2>
            <p className="text-gray-600 mb-6">
              We've sent a 6-digit OTP to your email address. Please check your inbox and use the OTP to reset your password.
            </p>
            <div className="space-y-3">
              <Link to="/verify-otp">
                <Button className="w-full">
                  Verify OTP
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EcoThrive</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Forgot Password</h2>
          <p className="text-gray-600 mt-2">Enter your email to receive a password reset OTP</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email address"
            error={errors.email}
          />

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="mt-6"
          >
            Send OTP
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
