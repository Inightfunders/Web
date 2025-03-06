"use client";

import { useState } from "react";
import InvestorModal from "@/components/modal/investorModals/requestDataModal";

export default function RequestDataContainer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        className="financial_detail_button border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition text-xs sm:text-sm"
        onClick={() => setIsModalOpen(true)}
      >
        Request more data
      </button>

       <InvestorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> 
    </>
  );
}
