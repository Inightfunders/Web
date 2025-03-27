'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { UploadProfilePicture } from '@/components/auth/UploadProfilePicture';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function SignUpPage({ searchParams }: Props) {
  const error =
    typeof searchParams.error === 'string' ? searchParams.error : undefined;
  const message =
    typeof searchParams.message === 'string' ? searchParams.message : undefined;

  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (error) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [error]);

  return (
    <section className="w-full flex flex-col bg-[#1A1A1A] min-h-screen">
      <header className="flex justify-start text-sm lg:text-base items-center py-4 px-2 lg:px-8 text-white gap-2 lg:gap-4 font-semibold">
        <Link
          href="https://insightfunders.com/"
          className="font-IntegralCF font-medium uppercase text-xs text-white"
        >
          <Image src="/images/iflogo.png" alt="logo" width={153} height={35} />
        </Link>
      </header>
      <div className="flex flex-col items-center justify-center gap-1 mt-24"></div>
      <UploadProfilePicture />
    </section>
  );
}
