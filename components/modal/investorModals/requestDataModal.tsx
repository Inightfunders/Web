"use client";

import { useState } from "react";
import { addFinancialDetailsRequest } from "@/lib/actions/investor";
import InvestorRequestReceivedModal from "./requestReceivedModal";
import { Loader2 } from "lucide-react";

interface InvestorModalProps {
  isOpen: boolean;
  onClose: () => void;
  investorId: number;
  startupId: number;
}

export default function InvestorModal({ isOpen, onClose, investorId, startupId }: InvestorModalProps) {
  if (!isOpen) return null;

  const [isModalReceivedOpen, setIsReceivedModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const { success, error } = await addFinancialDetailsRequest(investorId, startupId);

      if (success) {
        setHasRequested(true); // Change button text
        setIsReceivedModalOpen(true); // Show confirmation modal
      } else {
        console.error("Error sending request:", error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Request Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-2 sm:px-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl py-8 relative financial_detail_button">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-black w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 hover:bg-gray-300"
          >
            ✕
          </button>

          <hr className="mt-5 h-[3px] bg-gray-300 w-full" />

          {/* Modal Content */}
          <p className="text-black text-lg font-bold text-center py-6">
            {hasRequested
              ? "Are you sure you want to cancel your request?"
              : "Are you sure you want to send a request to P.I.P.E for more financial data?"}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <button
              onClick={onClose}
              className="border border-black text-black px-4 py-2 w-full sm:w-auto financial_detail_button"
            >
              Go back
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="bg-black text-white px-4 py-2 w-full sm:w-auto flex items-center justify-center gap-1 financial_detail_button disabled:opacity-65"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
             "Yes, send request!"
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <InvestorRequestReceivedModal
        isOpen={isModalReceivedOpen}
        onClose={() => setIsReceivedModalOpen(false)}
      />
    </>
  );
}
