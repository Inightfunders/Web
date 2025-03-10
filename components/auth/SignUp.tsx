'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

import '../../app/globals.css';

import { cn, isValidPassword } from '@/lib/utils';
import { signUp } from '@/lib/actions/auth';
import { RoleSelector, Role } from '@/components/auth/role-selector';

export default function SignUp() {
  const [lastAttempt, setLastAttempt] = useState<number>(0);
  const COOLDOWN_PERIOD = 60000; // 1 minute in milliseconds
  const router = useRouter();
  const [rolePage, setRolePage] = useState(true);
  const [role, setRole] = useState<Role>('startup');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }>({});
  type signUpValues = {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: 'startup' | 'investor' | 'partner';
  };

  const handleValueInitialization = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setErrors({});
    setRolePage(true);
  };

  const handleContinue = () => {
    if (rolePage) {
      handleValueInitialization();
      setRolePage(false);
    }
  };

  const validateFields = () => {
    let validationErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    } = {};

    if (!firstName.trim())
      validationErrors.firstName = 'First name is required';
    if (!lastName.trim()) validationErrors.lastName = 'Last name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      validationErrors.email = 'Invalid email format';
    }

    // Passwords must have 6 characters, 1 uppercase character, 1 lowercase character, 1 number, 1 non-alphanumeric character.
    if (!password.trim()) {
      validationErrors.password = 'Password is required';
    } else if (password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters';
    } else if (!isValidPassword(password)) {
      validationErrors.password = "Password doesn't meet requirements.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setIsPending(true);
    const now = Date.now();
    setError(null);
    if (now - lastAttempt < COOLDOWN_PERIOD) {
      return;
    }

    try {
      setLastAttempt(now);

      const values: signUpValues = {
        email,
        password,
        firstName,
        lastName,
        role
      };

      const result = await signUp(values);

      if (result.error) {
        console.log('signup error: ', result.error);
        setError(result.error);
        return;
      }

      if (result.success) {
        setIsPending(false);
        const role = values.role;
        if (role === 'partner') {
          router.push('/sign-up/partner/upload-profile-picture');
        } else {
          router.push('/personal-details');
        }
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const handleInputChange = (
    field: 'firstName' | 'lastName' | 'email' | 'password',
    value: string
  ) => {
    if (field === 'firstName') {
      setFirstName(value);
      if (errors.firstName)
        setErrors((prev) => ({ ...prev, firstName: undefined }));
    } else if (field === 'lastName') {
      setLastName(value);
      if (errors.lastName)
        setErrors((prev) => ({ ...prev, lastName: undefined }));
    } else if (field === 'email') {
      setEmail(value);
      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    } else {
      setPassword(value);
      if (errors.password) setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  return (
    <div className="max-w-[90vw] flex flex-col pb-8 gap-4 ipfield ">
      {rolePage ? (
        <>
          <p className="font-light text-white text-center">
            Select an option from below
          </p>

          <RoleSelector value={role} onChange={(value) => setRole(value)} />

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full !mt-8 bg-[#FF7A00] text-white font-medium rounded-[8px] mx-auto py-3.5 text-sm px-4 max-w-[216px] disabled:opacity-70"
          >
            Continue
          </button>

          {/* Back to Login */}
          <Link
            href="/sign-in"
            className="text-white font-normal text-sm mx-auto"
          >
            Back to login
          </Link>
        </>
      ) : (
        <>
          <div className="flex flex-col relative max-w-[450px] w-full">
            <input
              type="text"
              value={firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full max-w-[450px] ${
                errors.firstName ? 'border-red-500' : ''
              }`}
              placeholder="First name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div className="flex flex-col relative max-w-[450px] w-full">
            <input
              type="text"
              value={lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full max-w-[450px] ${
                errors.lastName ? 'border-red-500' : ''
              }`}
              placeholder="Last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
          <div className="flex flex-col relative max-w-[450px] w-full">
            <input
              type="text"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full max-w-[450px] ${
                errors.email ? 'border-red-500' : ''
              }`}
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col relative max-w-[450px] w-full">
            <div className="relative w-full">
              <input
                type={passwordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full ${
                  errors.password ? 'border-red-500' : ''
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
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="button"
            disabled={isPending}
            className="w-full !mt-4 bg-[#FF7A00] text-white font-bold rounded-[8px] mx-auto py-3.5 text-sm px-4 max-w-[216px] disabled:opacity-70"
            onClick={() => handleSubmit()}
          >
            {isPending ? (
              <Loader2 stroke="#fff" className="animate-spin mx-auto" />
            ) : (
              'Sign up'
            )}
          </button>
          <p className="text-white font-normal !mt-4 text-sm font-Montserrat mx-auto">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="text-[#FF7A00] underline font-normal"
            >
              Sign in
            </Link>
          </p>
          <p
            onClick={() => !isPending && setRolePage(true)}
            className="text-white text-sm flex items-center justify-start gap-1 cursor-pointer"
          >
            <ArrowLeft size={16} /> <span className="font-semibold">Back</span>
          </p>
        </>
      )}
    </div>
  );
}
