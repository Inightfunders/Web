'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { signUp } from '@/lib/actions/auth';
import Link from 'next/link';
import '../../app/globals.css';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [lastAttempt, setLastAttempt] = useState<number>(0);
  const COOLDOWN_PERIOD = 60000; // 1 minute in milliseconds
  const router = useRouter();
  const [rolePage, setRolePage] = useState(true);
  const [role, setRole] = useState<'startup' | 'investor' | 'partner'>(
    'startup'
  );
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
  const searchParams = useSearchParams();
  const value = searchParams.get("key");

  type signUpValues = {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: 'startup' | 'investor' | 'partner';
    ref: string;
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

    if (!password.trim()) {
      validationErrors.password = 'Password is required';
    } else if (password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters';
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
        role,
        ref: value ?? ""
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

          <div className="flex flex-col space-y-3 justify-center items-center">
            {/* Borrower Option */}
            <div
              className={cn(
                'm-auto flex justify-between items-start p-4 pb-6 gap-4 max-w-[360px] border-2 rounded-[12px] bg-white cursor-pointer selectcard',
                role === 'startup' ? 'border-[#FF7A00]' : 'border-white'
              )}
              onClick={() => setRole('startup')}
            >
              <div className="flex gap-4 pl-2 items-center">
                {role !== 'startup' ? (
                  <Circle size={24} fill="#fff" stroke="#00000080" />
                ) : (
                  <CheckCircle2 size={24} fill="#FF7A00" stroke="#fff" />
                )}
                <div className="flex flex-col gap-1">
                  <p className="text-black font-semibold text-base">Borrower</p>
                  <p className="text-black text-xs leading-5">
                    I am a borrower, looking for funding.
                  </p>
                </div>
              </div>
              <input
                type="radio"
                name="role"
                value="startup"
                checked={role === 'startup'}
                onChange={() => setRole('startup')}
                className="hidden"
              />
            </div>

            {/* Lender Option */}
            <div
              className={cn(
                'm-auto flex justify-between items-start p-4 pb-6 gap-4 max-w-[360px] border-2 rounded-[12px] bg-white cursor-pointer selectcard',
                role === 'investor' ? 'border-[#FF7A00]' : 'border-white'
              )}
              onClick={() => setRole('investor')}
            >
              <div className="flex gap-4 pl-2 items-center">
                {role !== 'investor' ? (
                  <Circle size={24} fill="#fff" stroke="#00000080" />
                ) : (
                  <CheckCircle2 size={24} fill="#FF7A00" stroke="#fff" />
                )}
                <div className="flex flex-col gap-1">
                  <p className="text-black font-semibold text-base">Lender</p>
                  <p className="text-black text-xs leading-5">
                    I am a lender, looking for deals.
                  </p>
                </div>
              </div>
              <input
                type="radio"
                name="role"
                value="investor"
                checked={role === 'investor'}
                onChange={() => setRole('investor')}
                className="hidden"
              />
            </div>

            {/* Partner Option */}
            <div
              className={cn(
                'm-auto flex justify-between items-start p-4 pb-6 gap-4 max-w-[360px] border-2 rounded-[12px] bg-white cursor-pointer selectcard',
                role === 'partner' ? 'border-[#FF7A00]' : 'border-white'
              )}
              onClick={() => setRole('partner')}
            >
              <div className="flex gap-4 pl-2 items-center">
                {role !== 'partner' ? (
                  <Circle size={24} fill="#fff" stroke="#00000080" />
                ) : (
                  <CheckCircle2 size={24} fill="#FF7A00" stroke="#fff" />
                )}
                <div className="flex flex-col gap-1">
                  <p className="text-black font-semibold text-base">Partner</p>
                  <p className="text-black text-xs leading-5">
                    I am interested in becoming a referral partner
                  </p>
                </div>
              </div>
              <input
                type="radio"
                name="role"
                value="partner"
                checked={role === 'partner'}
                onChange={() => setRole('partner')}
                className="hidden"
              />
            </div>
          </div>

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
