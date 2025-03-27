'use client';

import { useEffect, useState } from 'react';
import { updatePersonalDetails } from '@/lib/actions/onboarding';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { UserType } from '@/lib/types/user';
import { getUser } from '@/lib/actions/auth';
import { Link } from 'lucide-react';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
  user: UserType;
};

export default function PersonalDetails({ searchParams, user }: Props) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [ssn, setSSN] = useState<string>(''); // Explicitly define ssn type as string
  const [dob, setDob] = useState('');
  const [errors, setErrors] = useState<{
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    ssn?: string;
    dob?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string>('');

  const validateFields = () => {
    let validationErrors: {
      address?: string;
      city?: string;
      postalCode?: string;
      ssn?: string;
      dob?: string;
    } = {};

    if (!address.trim()) validationErrors.address = 'Address is required';
    if (!city.trim()) validationErrors.city = 'City is required';
    if (!postalCode.trim()) {
      validationErrors.postalCode = 'Postal code is required';
    } else if (!/^\d{5}$/.test(postalCode)) {
      validationErrors.postalCode = 'Postal code must be exactly 5 digits';
    }
    if (!ssn.trim()) validationErrors.ssn = 'SSN is required';
    if (!dob.trim()) {
      validationErrors.dob = 'Date of birth is required';
    } else if (!/^(0[1-9]|1[0-2])\/([0-2][1-9]|3[01])\/\d{4}$/.test(dob)) {
      validationErrors.dob = 'Invalid Date of Birth.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const error =
    typeof searchParams.error === 'string' ? searchParams.error : undefined;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [error]);

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setIsPending(true);

    const personalDataValues = {
      address1: address, // Rename 'address' to 'address1'
      city,
      state,
      postalCode,
      ssn,
      dateOfBirth: dob // Rename 'dob' to 'dateOfBirth'
    };
    const response = await updatePersonalDetails(personalDataValues);
    setIsPending(false);

    if (response.error) {
      console.log('personal details error: ', error);
      setOpen(true);
      setSubmitError(response.error);
    } else {
      const user = await getUser();
      if (
        user?.userInfo?.dwolla_customer_id &&
        user?.userInfo?.dwolla_customer_url &&
        user?.userInfo?.plaid_id
      ) {
        if (user.userInfo.role === 'startup') {
          return router.push('/startup-details');
        } else if (user.userInfo.role === 'investor') {
          return router.push('/investor-details');
        } else {
          return router.push('/investor-details');
        }
      }
    }
  };

  useEffect(() => {
    let value = dob?.replace(/\D/g, ''); // Remove non-digits
    let formattedValue = '';

    if (value.length > 0) {
      // Format as MM/DD/YYYY
      formattedValue = value.substring(0, 2);
      if (value.length > 2) {
        formattedValue += '/' + value.substring(2, 4);
      }
      if (value.length > 4) {
        formattedValue += '/' + value.substring(4, 8);
      }
    }

    setDob(formattedValue);
  }, [dob]);

  useEffect(() => {
    let value = ssn.replace(/\D/g, ''); // Remove non-numeric characters

    if (/^\d*$/.test(value)) {
      // Ensure only numbers are present
      let formattedValue = '';

      if (value.length > 0) {
        // Format as XXX-XX-XXXX
        formattedValue = value.substring(0, 3);
        if (value.length > 3) {
          formattedValue += '-' + value.substring(3, 5);
        }
        if (value.length > 5) {
          formattedValue += '-' + value.substring(5, 9);
        }
      }

      setSSN(formattedValue);
    }
  }, [ssn]);

  useEffect(() => {
    let value = postalCode.replace(/\D/g, ''); // Remove non-numeric characters

    if (value.length > 5) {
      value = value.substring(0, 5); // Restrict to 5 digits
    }

    setPostalCode(value);
  }, [postalCode]);

  const handleInputChange = (
    field: 'address' | 'city' | 'state' | 'postalCode' | 'ssn' | 'dob',
    value: string
  ) => {
    if (field === 'address') {
      setAddress(value);
      if (errors.address)
        setErrors((prev) => ({ ...prev, address: undefined }));
    } else if (field === 'city') {
      setCity(value);
      if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
    } else if (field === 'state') {
      setState(value);
      if (errors.state) setErrors((prev) => ({ ...prev, email: undefined }));
    } else if (field === 'postalCode') {
      const numericValue = value.replace(/\D/g, '').substring(0, 5);
      setPostalCode(numericValue);
      if (errors.postalCode)
        setErrors((prev) => ({ ...prev, postalCode: undefined }));
    } else if (field === 'ssn') {
      setSSN(value);
      if (errors.ssn) setErrors((prev) => ({ ...prev, ssn: undefined }));
    } else if (field === 'dob') {
      setDob(value);
      if (errors.dob) setErrors((prev) => ({ ...prev, dob: undefined }));
    }
  };

  return (
    <>
      <div className="max-w-[90vw] flex flex-col pb-8 gap-4 ipfield justify-center">
        <div className="flex flex-col relative max-w-[450px] w-full">
          <input
            type="text"
            value={address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full max-w-[450px] ${
              errors.address ? 'border-red-500' : ''
            }`}
            placeholder="Address"
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
        </div>
        <div className="flex flex-col relative max-w-[450px] w-full">
          <input
            type="text"
            value={city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full max-w-[450px] ${
              errors.city ? 'border-red-500' : ''
            }`}
            placeholder="City"
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>
        <div className="flex flex-col relative max-w-[450px] w-full">
          <select
            value={state || 'AL'}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full max-w-[450px] ${
              errors.state ? 'border-red-500' : ''
            }`}
          >
            {[
              'AL',
              'AK',
              'AZ',
              'AR',
              'CA',
              'CO',
              'CT',
              'DE',
              'FL',
              'GA',
              'HI',
              'ID',
              'IL',
              'IN',
              'IA',
              'KS',
              'KY',
              'LA',
              'ME',
              'MD',
              'MA',
              'MI',
              'MN',
              'MS',
              'MO',
              'MT',
              'NE',
              'NV',
              'NH',
              'NJ',
              'NM',
              'NY',
              'NC',
              'ND',
              'OH',
              'OK',
              'OR',
              'PA',
              'RI',
              'SC',
              'SD',
              'TN',
              'TX',
              'UT',
              'VT',
              'VA',
              'WA',
              'WV',
              'WI',
              'WY'
            ].map((stateOption) => (
              <option key={stateOption} value={stateOption}>
                {stateOption}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state}</p>
          )}
        </div>
        <div className="flex flex-col relative max-w-[450px] w-full">
          <input
            type="text"
            value={postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full max-w-[450px] ${
              errors.postalCode ? 'border-red-500' : ''
            }`}
            placeholder="Postal Code"
          />
          {errors.postalCode && (
            <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
          )}
        </div>
        <div className="flex flex-col relative max-w-[450px] w-full">
          <input
            type="text"
            value={ssn}
            onChange={(e) => handleInputChange('ssn', e.target.value)}
            className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full max-w-[450px] ${
              errors.ssn ? 'border-red-500' : ''
            }`}
            placeholder="SSN XXX-XX-XXXX"
          />
          {errors.ssn && (
            <p className="text-red-500 text-xs mt-1">{errors.ssn}</p>
          )}
        </div>
        <div className="flex flex-col relative max-w-[450px] w-full">
          <input
            type="text"
            value={dob}
            onChange={(e) => handleInputChange('dob', e.target.value)}
            className={`flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none w-full max-w-[450px] ${
              errors.dob ? 'border-red-500' : ''
            }`}
            placeholder="DOB MM/DD/YYYY"
          />
          {errors.dob && (
            <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
          )}
        </div>
        <button
          type="button"
          disabled={isPending}
          className="w-full !mt-4 bg-[#FF7A00] text-white font-bold rounded-[8px] mx-auto py-3.5 text-sm px-4 max-w-[216px] disabled:opacity-70"
          onClick={() => handleSubmit()}
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
        {open && (
          <div className="flex justify-center">
            <p className="text-red-500 text-xs mt-1">{submitError}</p>
          </div>
        )}
      </div>
    </>
  );
}
