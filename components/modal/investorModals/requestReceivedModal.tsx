"use client";

interface InvestorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InvestorRequestReceivedModal({ isOpen = false, onClose }: InvestorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mx-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-[600px] financial_detail_button py-10 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 hover:bg-gray-300"
        >
          ✕
        </button>

        <hr className="mt-2 h-[3px] bg-gray-300 w-full" />

        {/* Modal Content */}
        <p className="text-black text-md font-normal text-center py-6 flex-wrap">
          This company has received your request. Upon accepting your request to view their financial details, a
          notification will appear in Requests, where you can download their financial details PDF(s).
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="border border-black text-black px-4 py-2 financial_detail_button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
