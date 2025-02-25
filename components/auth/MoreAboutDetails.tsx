'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { moreAboutDetailsSchema } from '@/lib/validations/authSchema';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { UserType } from '@/lib/types/user';
import { getUser } from '@/lib/actions/auth';

type Props = {
    searchParams: { [key: string]: string | string[] | undefined };
    user: UserType;
};

export default function MoreAboutDetails({ searchParams, user }: Props) {

  const error =
    typeof searchParams.error === 'string' ? searchParams.error : undefined;

  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (error) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [error]);

  const router = useRouter();

  const form = useForm<z.infer<typeof moreAboutDetailsSchema>>({
    resolver: zodResolver(moreAboutDetailsSchema),
    defaultValues: {
      occupation: '',
      companyName: '',
    }
  });

  return (
    <>
      <Form {...form}>
        <form className="space-y-8 max-w-[90vw] flex flex-col gap-4 pb-8 ipfield">
          <FormField
            control={form.control}
            disabled={isPending}
            name="occupation"
            render={({ field }) => (
              <FormItem className="relative flex flex-col gap-1 !mt-0 max-w-[450px]">
                <FormControl>
                  <input
                    className="flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none"
                    placeholder="Occupation"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="block !mt-0 text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            disabled={isPending}
            name="companyName"
            render={({ field }) => (
              <FormItem className="relative flex flex-col gap-1 !mt-0 max-w-[450px]">
                <FormControl>
                  <input
                    className="flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none"
                    placeholder="Company name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="block !mt-0 text-red-600" />
              </FormItem>
            )}
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full !mt-4 bg-[#FF7A00] text-white font-bold rounded-[8px] mx-auto py-3.5 text-sm px-4 max-w-[216px] disabled:opacity-70"
          >
            Continue
          </button>
        </form>
      </Form>
    </>
  );
}
