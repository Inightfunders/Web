"use client";

import { useState, useEffect } from "react";
import InvestorModal from "@/components/modal/investorModals/requestDataModal";
import { getFinancialDetailsRequests, cancelFinancialDetailsRequests } from "@/lib/actions/investor";

type Props = { 
  investorId: number 
  startupId: number
}

export default function RequestDataContainer({ investorId, startupId }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [financialDetailRequest, setFinancialDetailRequest] = useState<any>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      const request = await getFinancialDetailsRequests(investorId, startupId);
      if (request && request.length > 0) {
        setFinancialDetailRequest(request[0]); // Store first request (assuming one per investor-startup)
      }
    };
    fetchRequest();
  }, [investorId, startupId]);

  const handleRequestSuccess = (newRequest: any) => {
    setFinancialDetailRequest(newRequest); // Update state with new request
    setIsModalOpen(false);
  };

  const handleCancelRequest = async () => {
    if (financialDetailRequest) {
      await cancelFinancialDetailsRequests(investorId, financialDetailRequest.id);
      setFinancialDetailRequest(null); // Remove the request from state after cancellation
    }
  };

  return (
    <>
      {financialDetailRequest ? (
        financialDetailRequest.accepted ? null : (
          <button
            className="border border-white text-white px-4 py-2 rounded-xl hover:bg-white hover:text-black transition text-xs sm:text-sm"
            onClick={handleCancelRequest}
          >
            Cancel Request
          </button>
        )
      ) : (
        <button
          className="border border-white text-white px-4 py-2 rounded-xl hover:bg-white hover:text-black transition text-xs sm:text-sm"
          onClick={() => setIsModalOpen(true)}
        >
          Request more data
        </button>
      )}

      <InvestorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        investorId={investorId}
        startupId={startupId}
        onRequestSuccess={handleRequestSuccess} // Pass callback to modal
      /> 
    </>
  );
}
