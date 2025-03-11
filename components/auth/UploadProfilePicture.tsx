'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import '../../app/globals.css';

import { UploadForm } from '@/components/ui/upload-form';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import {
  getProfileImageUrl,
  getUser,
  updateProfileImage
} from '@/lib/actions/auth';

export function UploadProfilePicture() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploaded, setUploaded] = useState(false);
  const [isLoading, setLoading] = React.useState(false);

  useEffect(() => {
    handleFile(imageFile);
  }, [imageFile]);

  async function handleFile(file: File | null) {
    if (file) {
      const fileSize = file.size / 1024 / 1024; // Convert size to MB

      // Check if the file is of valid type (JPG, PNG) and under 1MB
      if (fileSize <= 1 && file.type.includes('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  const handleUpload = async () => {
    setLoading(true);
    if (!imageFile) {
      setLoading(false);
      return;
    }

    if (isUploaded) {
      setLoading(false);
      router.push('/sign-up/partner/more-details');
      return;
    }

    const currentUser = await getUser();
    if (!currentUser) {
      setLoading(false);
      router.push('/');
      return;
    }

    const supabase = createClient();

    const fileExtension = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from('profileImg')
      .upload(fileName, imageFile);

    if (uploadError) {
      console.log(uploadError);
      setLoading(false);
      return;
    }

    await updateProfileImage(currentUser.user.id, fileName);

    setUploaded(true);

    const imageUrl = await getProfileImageUrl(fileName);
    setImageUrl(imageUrl);
    setLoading(false);
  };

  return (
    <div className="upload-container flex flex-col items-center justify-center max-w-[90vw] mx-auto py-8">
      <h1 className="font-montserrat font-bold text-[24px] leading-[29.26px] text-center text-white mb-4">
        Upload Profile Picture
      </h1>
      <p className="font-montserrat font-normal text-[16px] leading-[19.5px] text-center text-white mb-8">
        A picture can increase the chance of getting funds.
      </p>

      <div className="image-upload-container mb-6 relative rounded-full">
        <UploadForm
          className="flex flex-col items-center"
          fileType="image"
          fileUrl={imageUrl}
          onChange={(value) => setImageFile(value)}
        >
          <Image
            className={cn(
              'rounded-full w-[120px] h-[120px] object-cover',
              imageUrl ? 'border-[4px] border-[#FF7A00]' : ''
            )}
            width={120}
            height={120}
            src={imageUrl || '/images/profile-placeholder.svg'} // Replace with the image URL you want
            alt="Upload Profile Picture"
          />
          <span className="font-montserrat text-[14px] leading-[17.07px] tracking-[0%] text-[#FF7A00] py-2 rounded-md mt-[25px]">
            {imageUrl ? 'Re-upload' : 'Browse'}
          </span>
          <p className="text-xs text-gray-500 mt-2">
            Jpg, png and must be under 1 MB
          </p>
        </UploadForm>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="action-buttons flex gap-4 mt-6 flex-col justify-center items-center">
        <button
          className="w-[216px] h-[48px] gap-[10px] rounded-[8px] pt-[12px] pr-[81px] pb-[12px] pl-[81px] bg-[#FF7A00] text-white font-semibold font-montserrat text-[14px] leading-[17.07px]"
          onClick={() => handleUpload()}
        >
          {isLoading ? (
            <Loader2 stroke="#fff" className="animate-spin mx-auto" />
          ) : isUploaded ? (
            'Continue'
          ) : (
            'Upload'
          )}
        </button>
        <Link
          className="font-montserrat font-normal text-[13px] leading-[15.85px] tracking-[0%] text-gray-500 mt-[20px]"
          href="/more-details"
        >
          Skip for now
        </Link>
      </div>
    </div>
  );
}
