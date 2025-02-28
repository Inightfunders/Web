'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, X } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { submitApplication } from '@/lib/actions/onboarding';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '../../../../styles/global.css';

export default function StartUpSubmitApplication() {
  const router = useRouter();

  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pdfUrl = '/NDA.pdf';
  //  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!checked) {
      setError('You must agree to the Mutual NDA.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await submitApplication();

    if (error) setError(error);
    setIsSubmitting(false);

    router.refresh();
  };

  const docs = [
    {
      uri: '/Non-Circumvention and Confidentiality Agreement.pdf',
      fileType: 'pdf'
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-2 items-center justify-center">
        <Checkbox
          className="rounded-[4px] border-white checked:!text-white"
          checked={checked}
          onCheckedChange={(value) => {
            setChecked(value ? true : false);
            setError(null);
          }}
          id="terms"
        />
        <label
          htmlFor="terms"
          className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the{' '}
          <button
            onClick={() => setIsDialogOpen(true)}
            className="underline text-[#FF7A00]"
          >
            Mutual Non-Disclosure Agreement
          </button>
        </label>
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-[#FF7A00] text-white font-bold rounded-[2px] py-5 text-sm px-4"
      >
        {isSubmitting ? (
          <Loader2 stroke="#fff" className="animate-spin mx-auto" />
        ) : (
          'Submit Application'
        )}
      </button>

      {error && (
        <div className="w-full border-2 border-[#F86C6C] gap-4 rounded-[8px] bg-[#FEF2F2] flex items-center justify-center px-6 py-3 mt-1">
          <X size={18} className="text-[#F86C6C]" />
          <p className="text-black text-[12px]">{error}</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-full p-0 border-0 bg-transparent">
          <div className="relative h-[80vh] overflow-y-auto">
            <DialogClose className="absolute top-2 right-2 text-gray-700">
              <X size={24} />
            </DialogClose>
            <div className="w-full h-full">
              <Worker workerUrl="/pdfjs/pdf.worker.min.js">
                <Viewer fileUrl={pdfUrl} />
              </Worker>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <button
        onClick={() => {
          router.push('/startup-details/financial');
        }}
        className="text-white text-[13px py-2 px-4 bg-transparent font-Montserrat mt-2"
      >
        Go back
      </button>
    </div>
  );
}
