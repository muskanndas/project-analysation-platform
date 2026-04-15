import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';

const VerifyOtp = () => {
  const [formData, setFormData] = useState({
    email: '',
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'otp') {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
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
      const response = await authAPI.verifyOtp(formData.email, formData.otp);
      
      if (response.data.success) {
        setVerified(true);
        setTimeout(() => {
          navigate('/reset-password', { state: { email: formData.email } });
        }, 2000);
      }
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'OTP verification failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">OTP Verified!</h2>
            <p className="text-gray-600">Redirecting to reset password...</p>
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
          <h2 className="text-2xl font-semibold text-gray-800">Verify OTP</h2>
          <p className="text-gray-600 mt-2">Enter the 6-digit OTP sent to your email</p>
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
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
          />

          <InputField
            label="OTP Code"
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            placeholder="Enter 6-digit OTP"
            error={errors.otp}
            maxLength={6}
          />

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="mt-6"
          >
            Verify OTP
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600">
            Didn't receive the OTP?{' '}
            <button 
              onClick={() => navigate('/forgot-password')}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Resend OTP
            </button>
          </p>
          <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium block">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
