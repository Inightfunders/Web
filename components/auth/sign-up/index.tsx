import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import '../../../app/globals.css';

import { SignUpForm } from './form';
import { RoleSelector, Role } from '@/components/auth/sign-up/role-selector';

export default function SignUp() {
  const [rolePage, setRolePage] = useState(true);
  const [role, setRole] = useState<Role>('startup');

  const handleContinue = () => {
    if (rolePage) {
      setRolePage(false);
    }
  };

  return (
    <div className="max-w-[90vw] flex flex-col justify-center gap-4 ipfield ">
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
          <SignUpForm />
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
            className="text-white text-sm inline-flex items-center justify-start gap-1 cursor-pointer"
            onClick={() => setRolePage(true)}
          >
            <ArrowLeft size={16} /> <span className="font-semibold">Back</span>
          </p>
        </>
      )}
    </div>
  );
}
