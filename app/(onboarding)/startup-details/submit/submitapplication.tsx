'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { submitApplication } from '@/lib/actions/onboarding';
import { Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function StartUpSubmitApplication() {
  const router = useRouter();

  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pdfUrl] = useState(
    '/Non-Circumvention and Confidentiality Agreement.pdf'
  );
  //  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { error } = await submitApplication();

    if (error) setError(error);
    setIsSubmitting(false);

    router.refresh();
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-2 items-center justify-center">
        <Checkbox
          className="rounded-[4px] border-white checked:!text-white"
          checked={checked}
          onCheckedChange={(value) => setChecked(value ? true : false)}
          id="terms"
        />
        <label
          htmlFor="terms"
          className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the{' '}
          <button
            onClick={() => setIsDialogOpen(true)} // Open the dialog when clicked
            className="underline text-[#FF7A00]"
          >
            Mutual Non-Disclosure Agreement
          </button>
        </label>
      </div>
      <button
        onClick={handleSubmit}
        disabled={!checked}
        className="w-full bg-[#FF7A00] text-white font-bold rounded-[2px] py-5 text-sm px-4"
      >
        {isSubmitting ? (
          <Loader2 stroke="#fff" className="animate-spin mx-auto" />
        ) : (
          'Submit Application'
        )}
      </button>
      {error && (
        <div className="border-2 border-[#F86C6C] gap-4 rounded-[8px] bg-[#FEF2F2] flex items-center justify-center px-12 py-6">
          <X size={24} className="text-[#F86C6C]" />
          <p className="text-black font-semibold">{error}</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          <div className="relative">
            <DialogClose className="absolute top-2 right-2 text-gray-700">
              <X size={24} />
            </DialogClose>
            <embed
              src={pdfUrl}
              type="application/pdf"
              width="100%"
              height="800px"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
