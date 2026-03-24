// Login page
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import { loginSchema } from '@/lib/validation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', data);

      const { user, token } = response.data.data;

      // Store in localStorage and Zustand
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user, token);

      toast.success('Login successful!');
      router.push('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-luxury-cream px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-luxury-dark">Welcome Back</h1>
        <p className="mb-6 text-center text-gray-600">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block font-semibold text-luxury-dark">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-luxury-gold focus:outline-none"
              placeholder="you@example.com"
            />
            {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-2 block font-semibold text-luxury-dark">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-luxury-gold focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-luxury w-full disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-luxury-gold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
