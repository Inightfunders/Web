"use client";

import { useState } from "react";
import ContractContainer from "./contractcontainer";

interface MakeAnOfferProps {
  startupId: number;
}

export default function MakeAnOffer({ startupId }: MakeAnOfferProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Offer Button */}
      <button
        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition text-xs sm:text-sm financial_detail_button"
        onClick={() => setIsModalOpen(true)}
      >
        Make an offer
      </button>

      {/* Modal for ContractContainer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[500px] relative">
            <ContractContainer startupId={startupId} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
