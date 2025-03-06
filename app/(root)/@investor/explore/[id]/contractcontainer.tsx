"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/lib/actions/auth";
import { getContracts } from "@/lib/actions/investor";
import CreateContract from "./createcontract";

interface ContractContainerProps {
  startupId: number;
  onClose: () => void; // Add close function
}

export default function ContractContainer({ startupId, onClose }: ContractContainerProps) {
  const [user, setUser] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser();
        setUser(userData);

        if (userData?.userInvestor?.id) {
          const contractData = await getContracts(userData.userInvestor.id, startupId);
          setContract(contractData);
        }
      } catch (error) {
        console.error("Error fetching contract data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startupId]);

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg">
      <button onClick={onClose} className="self-end text-gray-500 hover:text-gray-800">
        ✕
      </button>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-gray-700 mt-2">Loading contract details...</p>
        </div>
      ) : contract?.contract ? (
        <p className="text-gray-700 text-center">
          This company has received your terms sheet. Upon accepting your request, a notification will appear in
          Requests, where you can then wire the funds for it to go into escrow & complete the investing process.
        </p>
      ) : (
        <CreateContract user={user!} startupId={startupId} />
      )}
    </div>
  );
}
