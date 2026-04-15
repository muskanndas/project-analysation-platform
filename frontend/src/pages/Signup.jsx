import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { STUDENT_DEPARTMENTS } from '../constants/studentDepartments';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (!formData.department) {
      newErrors.department = 'Please select your department';
    } else if (!STUDENT_DEPARTMENTS.includes(formData.department)) {
      newErrors.department = 'Invalid department selection';
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
      const response = await authAPI.register({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        department: formData.department,
      });
      
      if (response.data.success) {
        navigate('/login', {
          replace: true,
          state: { registered: true },
        });
      }
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const highlights = [
    'Structured project reviews and feedback',
    'Role-aware dashboards for your cohort',
    'Secure access with email-based sign-in',
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-40%,rgba(99,102,241,0.22),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-indigo-400/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgb(148_163_184/0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgb(148_163_184/0.35)_1px,transparent_1px)] [background-size:48px_48px]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 px-12 py-14 text-white lg:flex lg:w-[42%] xl:w-[40%]">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 45%), radial-gradient(circle at 80% 60%, rgba(56,189,248,0.2), transparent 40%)',
            }}
            aria-hidden
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200/90">
              Sambhavana
            </p>
            <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight tracking-tight">
              Turn project work into clear, actionable insight.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-indigo-100/90">
              Empowering project analysis and growth—one submission, review, and milestone at a time.
            </p>
          </div>
          <ul className="relative mt-12 space-y-4">
            {highlights.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-indigo-50/95">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Sambhavana
          </h1>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Join to organize submissions, track feedback, and grow with your department.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-8 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)] ring-1 ring-white/60 backdrop-blur-xl sm:p-9">
              {errors.general && (
                <div
                  className="mb-6 flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/90 p-4 text-sm text-red-800 shadow-sm"
                  role="alert"
                >
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <InputField
                  label="Full name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  error={errors.name}
                />

                <InputField
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@university.edu"
                  error={errors.email}
                />

                <div>
                  <InputField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    error={errors.password}
                    showPasswordToggle
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                  {formData.password && formData.password.length < 6 && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-amber-700">
                      <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Use at least 6 characters for a stronger password.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium tracking-tight text-slate-700"
                  >
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full rounded-xl border px-4 py-3 text-[15px] shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                      errors.department
                        ? 'border-red-300 bg-red-50/80 text-red-900 focus:border-red-400 focus:ring-red-200'
                        : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/25'
                    }`}
                  >
                    <option value="">Select department</option>
                    {STUDENT_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-red-600">
                      <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.department}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  loadingMessage="Creating account…"
                  disabled={loading}
                  className="mt-2 w-full rounded-xl py-3.5 text-[15px] font-semibold shadow-lg shadow-indigo-500/25"
                >
                  Create account
                </Button>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden>
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider text-slate-400">
                    <span className="bg-white/90 px-3">or</span>
                  </div>
                </div>

                <p className="mt-6 text-center text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Signup;
