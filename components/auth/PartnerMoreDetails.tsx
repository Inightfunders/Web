'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { UserType } from '@/lib/types/user';
import { getUser, upsertPartner } from '@/lib/actions/auth';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
  user: UserType;
};

export default function PartnerMoreDetails({ searchParams, user }: Props) {
  const error =
    typeof searchParams.error === 'string' ? searchParams.error : undefined;

  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [occupation, setOccupation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    occupation?: string;
    companyName?: string;
  }>({});

  useEffect(() => {
    if (error) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [error]);

  const router = useRouter();

  const validateFields = () => {
    let validationErrors: { occupation?: string; companyName?: string } = {};

    if (!occupation.trim())
      validationErrors.occupation = 'Occupation is required';
    if (!companyName.trim())
      validationErrors.companyName = 'Company Name is required';

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const currentUser = await getUser();
      if (!currentUser) {
        setLoading(false);
        router.push('/');
        return;
      }

      const { success } = await upsertPartner({
        userId: currentUser.user.id,
        occupation,
        companyName
      });
      setLoading(false);

      if (success) {
        router.push('/');
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const handleInputChange = (
    field: 'occupation' | 'companyName',
    value: string
  ) => {
    if (field === 'occupation') {
      setOccupation(value);
      if (errors.occupation)
        setErrors((prev) => ({ ...prev, occupation: undefined }));
    } else {
      setCompanyName(value);
      if (errors.companyName)
        setErrors((prev) => ({ ...prev, companyName: undefined }));
    }
  };

  return (
    <div className="space-y-8 max-w-[90vw] flex flex-col gap-4 pb-8 ipfield">
      <div className="flex flex-col">
        <input
          type="text"
          value={occupation}
          onChange={(e) => handleInputChange('occupation', e.target.value)}
          className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-screen max-w-[450px] ${
            errors.occupation ? 'border-red-500' : ''
          }`}
          placeholder="Occupation"
        />
        {errors.occupation && (
          <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>
        )}
      </div>

      <div className="flex flex-col">
        <input
          type="text"
          value={companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-screen max-w-[450px] ${
            errors.companyName ? 'border-red-500' : ''
          }`}
          placeholder="Company Name"
        />
        {errors.companyName && (
          <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
        )}
      </div>

      <button
        disabled={loading}
        className="w-full !mt-4 bg-[#FF7A00] text-white font-bold rounded-[8px] mx-auto py-3.5 text-sm px-4 max-w-[216px] disabled:opacity-70"
        type="submit"
        onClick={() => handleSubmit()}
      >
        {loading ? (
          <Loader2 stroke="#fff" className="animate-spin mx-auto" />
        ) : (
          'Continue'
        )}
      </button>
    </div>
  );
}
