"use client";

import { UserType } from "@/lib/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

const editBasicInfoSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  company_name: z.string().min(1),
  company_email: z.string().email(),
//   investor_type: z.string().min(1),
  institution_type: z.string().min(1),
  future_investment_amount: z.string().min(1),
});

export default function BasicInfoDetails({ 
  user,
  onUpdate 
}: { 
  user: UserType;
  onUpdate?: (updatedUser: Partial<UserType>) => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const edit = searchParams.get("edit");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);

  const form = useForm<z.infer<typeof editBasicInfoSchema>>({
    resolver: zodResolver(editBasicInfoSchema),
    defaultValues: {
      firstName: user?.userInfo?.first_name ?? "",
      lastName: user?.userInfo?.last_name ?? "",
      email: user?.user?.email ?? "",
      company_name: user?.userInvestor?.company_name ?? "",
      company_email: user?.userInvestor?.company_email ?? "",
      institution_type: Array.isArray(user?.userInvestor?.institution_type) ? user?.userInvestor?.institution_type[0] ?? "" : user?.userInvestor?.institution_type ?? "",
      future_investment_amount: Array.isArray(user?.userInvestor?.future_investment_amount) ? user?.userInvestor?.future_investment_amount[0] ?? "" : user?.userInvestor?.future_investment_amount ?? ""
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.userInfo?.first_name || "",
        lastName: user.userInfo?.last_name || "",
        email: user.user?.email || "",
        company_name: user.userInvestor?.company_name || "",
        company_email: user.userInvestor?.company_email || "",
        institution_type: Array.isArray(user?.userInvestor?.institution_type) ? user?.userInvestor?.institution_type[0] || "" : user?.userInvestor?.institution_type || "",
        future_investment_amount: Array.isArray(user?.userInvestor?.future_investment_amount) ? user?.userInvestor?.future_investment_amount[0] || "" : user?.userInvestor?.future_investment_amount || ""
      });
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof editBasicInfoSchema>) => {
    if (!user || !user.userInvestor?.id) {
      return;
    }

    setIsLoading(true);
    setError("");
  
    const supabase = createClient();
  
    try {
      // Update the authenticated user's email if changed
      const { error: updateUserError } = await supabase.auth.updateUser({email: values.email,});
  
      if (updateUserError) {
        setError(updateUserError.message);
        setIsLoading(false);
        return;
      }
  
      // Update user details in database
      const { error: updateUserTableError } = await supabase.from("users").update({
          first_name: values.firstName,
          last_name: values.lastName,
        }).eq("id", user?.user?.id!);
  
      const { error: updateInvestorError } = await supabase.from("investors")
        .update({
          company_name: values.company_name,
          company_email: values.company_email,
          institution_type: values.institution_type as
            | "Other"
            | "Corporation"
            | "Family Office"
            | "Fund"
            | "Registered Investment Advisor (RIA)"
            | null
            | undefined,
            future_investment_amount: values.future_investment_amount as
            | 'Less than $250K'
            | '$250K - $1M'
            | 'S1M - $5M'
            | '$5M+'
            | 'Not sure'
            | null
            | undefined,
        }).eq("id", user?.userInvestor?.id!);
  
      if (updateUserTableError) {
        setError(updateUserTableError.message);
      }
      if (updateInvestorError) {
        setError(updateInvestorError.message);
      }

      if (onUpdate) {
        onUpdate({
          user: {
            ...user.user, email: values.email,
          },
          userInfo: {
            ...user.userInfo,
            first_name: values.firstName,
            last_name: values.lastName,
            role: user?.userInfo?.role ?? null,
            profile_img: user?.userInfo?.profile_img ?? null,
            plaid_id: user?.userInfo?.plaid_id ?? null,
            dwolla_customer_id: user?.userInfo?.dwolla_customer_id ?? null,
            dwolla_customer_url: user?.userInfo?.dwolla_customer_url ?? null,
          },
          userInvestor: {
            ...user.userInvestor,
            accepted: user.userInvestor?.accepted ?? true,
            company_website: user.userInvestor?.company_website ?? null,
            company_name: values.company_name,
            company_email: values.company_email,
            institution_type: values.institution_type as
              | "Other"
              | "Corporation"
              | "Family Office"
              | "Fund"
              | "Registered Investment Advisor (RIA)"
              | null,
            future_investment_amount: values.future_investment_amount as
              | "Less than $250K"
              | "$250K - $1M"
              | "S1M - $5M"
              | "$5M+"
              | "Not sure"
              | null,
          }
        });
      }
      
      if (values.email !== user?.user?.email) {
        setEmailChanged(true);
        setTimeout(() => {
          setError("");
          router.push("/profile");
          router.refresh();
        }, 1000);
      } else {
        router.push("/profile");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return edit ? (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-8"
      >
        <div className="flex items-center justify-center flex-wrap gap-8">
          <FormField
            control={form.control}
            disabled={isLoading}
            name="firstName"
            render={({ field }) => (
              <FormItem className="relative flex flex-col gap-1 w-screen max-w-[384px]">
                <FormLabel className="text-left text-white">
                  First Name
                </FormLabel>
                <FormControl>
                  <input
                    className="flex flex-1 px-12 placeholder:font-light py-5 rounded-[2px] outline-none"
                    placeholder="First Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="absolute text-red-600 -bottom-6" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            disabled={isLoading}
            name="lastName"
            render={({ field }) => (
              <FormItem className="relative flex flex-col gap-1 w-screen max-w-[384px]">
                <FormLabel className="text-left text-white  ">
                  Last Name
                </FormLabel>
                <FormControl>
                  <input
                    className="flex flex-1 px-12 placeholder:font-light py-5 rounded-[2px] outline-none"
                    placeholder="Last Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="absolute text-red-600 -bottom-6" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            disabled={isLoading}
            name="email"
            render={({ field }) => (
              <FormItem className="relative flex flex-col gap-1 w-screen max-w-[384px]">
                <FormLabel className="text-left text-white ">Email</FormLabel>
                <FormControl>
                  <input
                    className="flex flex-1 px-12 placeholder:font-light py-5 rounded-[2px] outline-none"
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="absolute text-red-600 -bottom-6" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            disabled={isLoading}
            name="company_name"
            render={({ field }) => (
              <FormItem className="relative flex flex-col gap-1 w-screen max-w-[384px]">
                <FormLabel className="text-left text-white ">Company Name</FormLabel>
                <FormControl>
                  <input
                    className="flex flex-1 px-12 placeholder:font-light py-5 rounded-[2px] outline-none"
                    placeholder="Company Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="absolute text-red-600 -bottom-6" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            disabled={isLoading}
            name="company_email"
            render={({ field }) => (
              <FormItem className="relative flex flex-col gap-1 w-screen max-w-[384px]">
                <FormLabel className="text-left text-white ">Company Email</FormLabel>
                <FormControl>
                  <input
                    className="flex flex-1 px-12 placeholder:font-light py-5 rounded-[2px] outline-none"
                    placeholder="Company Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="absolute text-red-600 -bottom-6" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            disabled={isLoading}
            name="institution_type"
            render={({ field }) => (
              <FormItem className="relative flex flex-col gap-1 w-screen max-w-[384px]">
                <FormLabel className="text-left text-white ">Institution Type</FormLabel>
                <FormControl>
                    <select
                        defaultValue={field.value}
                        className="flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none"
                        {...field}
                      >
                        <option disabled value="">
                            Institution Type
                        </option>
                        {[
                            'Corporation',
                            'Family Office',
                            'Fund',
                            'Registered Investment Advisor (RIA)',
                            'Other',
                        ].map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                    </select>
                </FormControl>
                <FormMessage className="absolute text-red-600 -bottom-6" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            disabled={isLoading}
            name="future_investment_amount"
            render={({ field }) => (
              <FormItem className="relative flex flex-col gap-1 w-screen max-w-[384px]">
                <FormLabel className="text-left text-white ">Amount that can be invested over the next 12 months</FormLabel>
                <FormControl>
                    <select
                        defaultValue={field.value}
                        className="flex flex-1 px-6 placeholder:font-light py-3.5 text-sm rounded-[8px] outline-none"
                        {...field}
                      >
                        <option disabled value="">
                          Amount that can be invested over the next 12 months
                        </option>
                        {[
                          'Less than $250K',
                          '$250K - $1M',
                          'S1M - $5M',
                          '$5M+',
                          'Not sure'
                        ].map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                    </select>
                </FormControl>
                <FormMessage className="absolute text-red-600 -bottom-6" />
              </FormItem>
            )}
          />
        </div>
        <button
          type="submit"
          className="rounded-[2px] bg-white text-black mt-4 mx-auto text-sm px-2.5 text-nowrap py-1.5 w-16"
        >
          {isLoading ? (
            <Loader2 stroke="#000" className="animate-spin mx-auto" />
          ) : (
            "Submit"
          )}
        </button>
        {error && (
          <div className="border-2 border-[#7f2315] gap-2 mt-4 rounded-[8px] min-w-[384px] max-w-[384px] mx-auto bg-[#541c15] flex items-center justify-center px-12 py-6 ">
            <p className="text-white font-semibold text-center">{error}</p>
          </div>
        )}
        {emailChanged && (
          <div className="border-2 border-[#157f2f] gap-2 mt-4 rounded-[8px] min-w-[384px] max-w-[384px] mx-auto bg-[#1a5415] flex items-center justify-center px-12 py-6">
            <p className="text-white font-semibold text-center">
              Please check your new email's inbox for a verification email.
            </p>
          </div>
        )}
      </form>
    </Form>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="flex flex-col flex-1 gap-2 items-start justify-center">
        <p className="font-normal font-Montserrat text-white text-xs">
          Your Name
        </p>
        <p className="text-white font-bold text-base font-Montserrat">
          {user?.userInfo?.first_name} {user?.userInfo?.last_name}
        </p>
      </div>
      <div className="flex flex-col flex-1 gap-2 items-start justify-center">
        <p className="font-normal font-Montserrat text-white text-xs">
          Your Email
        </p>
        <p className="text-white font-bold text-base font-Montserrat">
          {user?.user?.email}
        </p>
      </div>
      <div className="flex flex-col flex-1 gap-2 items-start justify-center">
        <p className="font-normal font-Montserrat text-white text-xs">
            Company Name
        </p>
        <p className="text-white font-bold text-base font-Montserrat">
            {user?.userInvestor?.company_name}
        </p>
      </div>
      <div className="flex flex-col flex-1 gap-2 items-start justify-center">
        <p className="font-normal font-Montserrat text-white text-xs">
            Company Email
        </p>
        <p className="text-white font-bold text-base font-Montserrat">
            {user?.userInvestor?.company_email}
        </p>
      </div>
      <div className="flex flex-col flex-1 gap-2 items-start justify-center">
        <p className="font-normal font-Montserrat text-white text-xs">
            Type of Investor
        </p>
        <p className="text-white font-bold text-base font-Montserrat">
            {user?.userInvestor?.investor_type}
        </p>
      </div>
      <div className="flex flex-col flex-1 gap-2 items-start justify-center">
        <p className="font-normal font-Montserrat text-white text-xs">
            Type of institution
        </p>
        <p className="text-white font-bold text-base font-Montserrat">
            {user?.userInvestor?.institution_type}
        </p>
      </div>
      <div className="flex flex-col flex-1 gap-2 items-start justify-center">
        <p className="font-normal font-Montserrat text-white text-xs text-left">
            Amount that can be invested over the next 12 months
        </p>
        <p className="text-white font-bold text-base font-Montserrat">
            {user?.userInvestor?.future_investment_amount}
        </p>
      </div>
    </div>
  );
}
