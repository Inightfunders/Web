'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { signUp } from '@/lib/actions/auth';
import { useSearchParams } from "next/navigation";

const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['startup', 'investor', 'partner'])
});

type SignupFormValues = z.infer<typeof signupSchema>;

type Role = 'startup' | 'investor' | 'partner';

interface Props {
  className?: string;
  role: SignupFormValues['role'];
}

export const SignUpForm: React.FC<Props> = ({ className = '', role }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const value = searchParams.get("key");

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role
    }
  });

  const [isLoading, setLoading] = React.useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    try {
      const result = await signUp({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        ref: value ?? ""
      });
      if (result.error) {
        setError(result.error);
        return;
      }

      const role = data.role;

      console.log('role - ', role);

      if (role === 'partner') {
        router.push('/sign-up/partner/upload-profile-picture');
      } else {
        router.push('/personal-details');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col space-y-5"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div
        className={cn('flex flex-col relative max-w-[450px] w-full', className)}
      >
        <input
          {...form.register('firstName')}
          className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full max-w-[450px] ${
            form.formState.errors.firstName ? 'border-red-500' : ''
          }`}
          placeholder="First name"
        />
        {form.formState.errors.firstName && (
          <p className="text-red-500 text-xs mt-1">
            {form.formState.errors.firstName.message}
          </p>
        )}
      </div>
      <div className="flex flex-col relative max-w-[450px] w-full">
        <input
          {...form.register('lastName')}
          className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full max-w-[450px] ${
            form.formState.errors.lastName ? 'border-red-500' : ''
          }`}
          placeholder="Last name"
        />
        {form.formState.errors.lastName && (
          <p className="text-red-500 text-xs mt-1">
            {form.formState.errors.lastName.message}
          </p>
        )}
      </div>
      <div className="flex flex-col relative max-w-[450px] w-full">
        <input
          {...form.register('email')}
          className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full max-w-[450px] ${
            form.formState.errors.email ? 'border-red-500' : ''
          }`}
          placeholder="Email"
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-xs mt-1">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <div className="flex flex-col relative max-w-[450px] w-full">
        <div className="relative w-full">
          <input
            {...form.register('password')}
            type={passwordVisible ? 'text' : 'password'}
            className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full ${
              form.formState.errors.password ? 'border-red-500' : ''
            }`}
            placeholder="Password"
          />
          <div
            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setPasswordVisible((prev) => !prev);
            }}
          >
            {passwordVisible ? <Eye size={18} /> : <EyeOff size={18} />}
          </div>
        </div>
        {form.formState.errors.password && (
          <p className="text-red-500 text-xs mt-1">
            {form.formState.errors.password.message}
          </p>
        )}
        <p className="text-[13px] text-[#808080] mt-1">
          Passwords must have 8 characters, 1 uppercase character, 1 number.
        </p>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <button
        className="!mt-10 bg-[#FF7A00] text-white font-bold rounded-[8px] mx-auto text-sm w-[216px] disabled:opacity-70 h-[48px]"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 stroke="#fff" className="animate-spin mx-auto" />
        ) : (
          'Sign up'
        )}
      </button>
    </form>
  );
};
