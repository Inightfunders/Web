import Image from 'next/image';
import Link from 'next/link';
import { getUser } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import PartnerMoreDetails from '@/components/auth/PartnerMoreDetails';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function MoreAboutDetailsPage({ searchParams }: Props) {
  const user = await getUser();

  if (!user) return redirect('/');

  return (
    <section className={`w-full flex flex-col bg-[#1A1A1A] min-h-screen `}>
      <header className="flex justify-start text-sm lg:text-base items-center py-4 px-2 lg:px-8 text-white gap-2 lg:gap-4 font-semibold">
        <Link
          href="/"
          className="font-IntegralCF font-medium uppercase text-xs text-white"
        >
          <Image src="/images/iflogo.png" alt="logo" width={153} height={35} />
        </Link>
      </header>
      <div className="flex flex-col items-center justify-center gap-8 mt-[140px]">
        <div className="flex flex-col items-center justify-center gap-4 mt-8">
          <h1 className="text-2xl font-semibold text-white text-center">
            Tell us more about you
          </h1>
          <h2 className="text-base text-center font-light text-white">
            select an option from below
          </h2>
        </div>
        <PartnerMoreDetails searchParams={searchParams} user={user} />
      </div>
    </section>
  );
}
