"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { contractSchema } from "@/lib/validations/investorsSchema";
import { UserType } from "@/lib/types/user";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, CheckCircleIcon, Loader2, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { createContract } from "@/lib/actions/investor";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

type Props = {
  user: UserType;
  startupId: number;
};

const numericRegex = /^-?\d*\.?\d+(?:[eE][-+]?\d+)?$/;

export default function CreateContract({ user, startupId }: Props) {
  const router = useRouter();

  // console.log({ user });

  const [isLoading, setIsLoading] = useState(false);
  const [signedAgreement, setSignedAgreement] = useState(false);
  const [signature, setSignature] = useState("");
  const [signatureError, setSignatureError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof contractSchema>>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      investorId: user?.userInvestor?.id!,
      startupId,
      amountInvested: undefined,
      interestRate: undefined,
      maturityDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      paymentInterval: undefined,
      termSheet: new File([], ""),
    },
  });

  const onSubmit = async (values: z.infer<typeof contractSchema>) => {
    setIsLoading(true);

    const supabase = createClient();

    const fileName = `${nanoid(30)}.pdf`;

    const { error: storageError } = await supabase.storage
      .from("termSheets")
      .upload(fileName, values.termSheet);

    if (storageError) {
      console.log(storageError);
      return setIsLoading(false);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("termSheets").getPublicUrl(fileName);
    console.log("data", publicUrl);
    const { error } = await createContract({ ...values, termSheet: publicUrl });

    if (error) setError(error);
    else setSuccess(true);

    setIsLoading(false);
  };

  const handleSubmitSignature = () => {
    if (
      !signature ||
      !(
        user?.userInfo?.first_name === signature ||
        user?.userInfo?.last_name === signature ||
        signature ===
          `${user?.userInfo?.first_name} ${user?.userInfo?.last_name}`
      )
    ) {
      setSignatureError("Signature does not match user name");
    } else {
      setSignatureError("");
      setSignedAgreement(true);
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  }, [success]);

  return (
    <div className="flex flex-col">
      {!signedAgreement ? (
        <div className="flex flex-col items-center justify-center gap-6">
          {/* <p className='text-white font-bold text-base'>Agreement Document</p>
                    <p className='text-white font-bold text-base'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. <br />Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> */}
          <div className="mt-4 relative flex flex-col ml-auto">
            <input
              type="text"
              placeholder="Investor's Signature"
              className="bg-transparent border-black text-black w-[294px] outline py-1.5"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
            />
            {signatureError && (
              <p className="text-red-500 text-left mr-auto text-[10px]">
                {signatureError}
              </p>
            )}
            <button
              onMouseDown={handleSubmitSignature}
              className="w-fit rounded-[5px] bg-black text-white !text-[10px] mt-4 ml-auto text-xs px-2.5 text-nowrap py-1.5"
            >
              Proceed
            </button>
          </div>
        </div>
      ) : (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center justify-center gap-6 p-0 sm:p-4">
          <div className="flex flex-wrap justify-center gap-6 w-full max-w-2xl">
            {/* Amount Invested */}
            <FormField
              control={form.control}
              disabled={isLoading || success}
              name="amountInvested"
              render={({ field }) => (
                <FormItem className="relative flex flex-col gap-1 w-full">
                  <FormLabel className="text-left text-gray-700">Amount Invested</FormLabel>
                  <FormControl>
                    <input
                      className="w-full px-4 py-3 border rounded-xl !border-gray-500"
                      placeholder="Enter amount"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )}
            />
  
            {/* Interest Rate */}
            <FormField
              control={form.control}
              disabled={isLoading || success}
              name="interestRate"
              render={({ field }) => (
                <FormItem className="relative flex flex-col gap-1 w-full">
                  <FormLabel className="text-left text-gray-700">Interest Rate</FormLabel>
                  <FormControl>
                    <input
                      className="w-full px-4 py-3 border rounded-xl !border-gray-500"
                      placeholder="Enter interest rate"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )}
            />
  
            {/* Payment Interval */}
            <FormField
              control={form.control}
              disabled={isLoading || success}
              name="paymentInterval"
              render={({ field }) => (
                <FormItem className="relative flex flex-col gap-1 w-full">
                  <FormLabel className="text-left text-gray-700">Payment Interval</FormLabel>
                  <FormControl>
                    <select className="w-full px-4 py-3 border rounded-xl !border-gray-500 " {...field}>
                      <option value="">Select Payment Interval</option>
                      <option value="month">Month</option>
                      <option value="week">Week</option>
                      <option value="quarter">Quarter</option>
                      <option value="year">Year</option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )}
            />
  
            {/* Maturity Date */}
            <FormField
              control={form.control}
              disabled={isLoading || success}
              name="maturityDate"
              render={({ field }) => (
                <FormItem className="relative flex flex-col gap-1 w-full">
                  <FormLabel className="text-left text-gray-700">Maturity Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full px-4 py-3 border bg-white rounded-xl !border-gray-500">
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const minDate = new Date();
                            minDate.setDate(minDate.getDate() + 7);
                            return date < minDate;
                          }}
                          initialFocus
                          className="bg-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )}
            />
  
            {/* Term Sheet Upload */}
            <FormField
              control={form.control}
              disabled={isLoading || success}
              name="termSheet"
              render={({ field }) => (
                <FormItem className="relative flex flex-col gap-1 w-full">
                  <FormLabel className="text-left text-gray-700">Term Sheet</FormLabel>
                  <FormControl>
                    <div className="border border-gray-500 rounded-xl px-4 py-3 flex items-center justify-between bg-white">
                      <input
                        type="file"
                        onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                        className="hidden"
                        id="upload"
                      />
                      <label htmlFor="upload" className="cursor-pointer">
                        Choose File
                      </label>
                      <span className="text-sm text-gray-500">
                        {field.value ? field.value.name : "No file chosen"}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )}
            />
          </div>
  
          {/* Submit Button */}
          <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-[5px] text-sm mt-4">
            Submit Contract
          </button>
        </form>
      </Form>
  
      )}
      <Dialog open={isLoading}>
        <DialogContent className="flex items-center justify-center bg-transparent border-none shadow-none outline-none">
          <Loader2 className="animate-spin" size={42} color="#74c1ed" />
        </DialogContent>
      </Dialog>
      <Dialog open={success}>
        <DialogContent className="flex items-center justify-center bg-transparent border-none shadow-none outline-none">
          <CheckCircleIcon size={42} color="#006239" />
          <p className="text-white font-semibold">Contract Submitted</p>
        </DialogContent>
      </Dialog>
      {error && (
        <div className="border-2 border-[#7f2315] gap-2 mt-4 rounded-[8px] min-w-[384px] max-w-[384px] mx-auto bg-[#541c15] flex items-center justify-center px-12 py-6">
          <X size={24} className="text-[#7f2315]" />
          <p className="text-white font-semibold">{error}</p>
        </div>
      )}
    </div>
  );
}
