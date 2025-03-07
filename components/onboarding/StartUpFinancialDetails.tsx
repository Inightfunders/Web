'use client';

import { startUpFinancialDetailsSchema } from '@/lib/validations/onBoardingSchema';
import { useEffect, useState } from 'react';
import { updateFinancialDetails } from '@/lib/actions/onboarding';
import PlaidLink from '../plaid/PlaidLink';
import { UserType } from '@/lib/types/user';
import { getBankAccount } from '@/lib/actions/user';
import { X } from 'lucide-react';
import { updatePage } from '@/lib/server';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Props = {
  user: UserType;
};

export default function StartUpFinancialDetailsContainer({ user }: Props) {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const [stage, setStage] = useState('Pre-seed');
  const [recentRaise, setRecentRaise] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{
    stage?: string;
    recentRaise?: string;
  }>({});

  const checkBankConnected = async () => {
    const bankAccount = await getBankAccount(user?.user.id!);

    if (!bankAccount) return false;
    return true;
  };

  const validateFields = () => {
    let validationErrors: {
      recentRaise?: string;
    } = {};

    if (!recentRaise.trim())
      validationErrors.recentRaise = 'Recent raise is required';

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleInputChange = (field: 'stage' | 'recentRaise', value: string) => {
    if (field === 'stage') {
      setStage(value);
      if (errors.stage) setErrors((prev) => ({ ...prev, email: undefined }));
    } else if (field === 'recentRaise') {
      setRecentRaise(value);
      if (errors.recentRaise)
        setErrors((prev) => ({ ...prev, recentRaise: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setIsPending(true);

    const financialDetailsValues = {
      stage: stage as
        | 'Pre-seed'
        | 'Seed'
        | 'Series A'
        | 'Series B'
        | 'Series C'
        | 'Series D'
        | 'Series E'
        | 'Series F'
        | 'Public',
      recentRaise: Number(recentRaise)
    };

    // const bankConnected = await checkBankConnected();

    // if (!bankConnected) {
    //   setError("Please connect your bank account");
    //   setIsPending(false);
    //   return;
    // }

    await updateFinancialDetails(financialDetailsValues);
    setIsPending(false);
    await updatePage('/startup-details/financial');
    await updatePage('/startup-details');
    await updatePage('/startup-details/submit');

    router.push('/startup-details/submit');
  };

  return (
    <>
      <div className="max-w-[90vw] flex flex-col pb-8 gap-4 ipfield">
        {/* <PlaidLink user={user} /> */}
        <div className="flex flex-col relative max-w-[450px] w-full">
          <select
            value={stage || 'Pre-seed'}
            onChange={(e) => handleInputChange('stage', e.target.value)}
            className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full max-w-[450px] ${
              errors.stage ? 'border-red-500' : ''
            }`}
          >
            {[
              'Pre-seed',
              'Seed',
              'Series A',
              'Series B',
              'Series C',
              'Series D',
              'Series E',
              'Series F',
              'Public'
            ].map((stageOption) => (
              <option key={stageOption} value={stageOption}>
                {stageOption}
              </option>
            ))}
          </select>
          {errors.stage && (
            <p className="text-red-500 text-xs mt-1">{errors.stage}</p>
          )}
        </div>
        <div className="flex flex-col relative max-w-[450px] w-full">
          <label className="text-white mb-1">Recent Raise (in USD)</label>
          <div className="flex flex-1 relative">
            <p className="text-black absolute top-[0.975rem] left-[1rem] text-xs">
              $
            </p>
            <input
              type="text"
              value={recentRaise.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, ''); // Remove commas
                if (/^\d*$/.test(rawValue)) {
                  setRecentRaise(rawValue);
                  if (errors.recentRaise)
                    setErrors((prev) => ({ ...prev, recentRaise: undefined }));
                }
              }}
              className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full max-w-[450px] ${
                errors.recentRaise ? 'border-red-500' : ''
              }`}
              placeholder=""
            />
          </div>
          {errors.recentRaise && (
            <p className="text-red-500 text-xs mt-1">{errors.recentRaise}</p>
          )}
        </div>
        <button
          type="button"
          disabled={isPending}
          className="w-full !mt-8 bg-[#FF7A00] text-white font-bold rounded-[8px] mx-auto py-3.5 text-sm px-4 max-w-[216px] disabled:opacity-70"
          onClick={() => handleSubmit()}
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </button>

        {error && (
          <div className="border-2 border-[#F86C6C] gap-4 rounded-[8px] bg-[#FEF2F2] flex items-center justify-center px-4 py-6">
            <X size={24} className="text-[#F86C6C]" />
            <p className="text-black font-semibold">{error}</p>
          </div>
        )}
      </div>
      <Link
        href="/startup-details"
        className="text-white text-[13px py-2 px-4 bg-transparent font-Montserrat mt-2 flex justify-center w-full"
      >
        Go back
      </Link>
    </>
  );
}
