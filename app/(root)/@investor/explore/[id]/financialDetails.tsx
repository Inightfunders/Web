"use client";

import React, { useState, useEffect } from "react";
import { Eye, Loader2 } from "lucide-react";
import { getFinancialDetailsRequests } from "@/lib/actions/investor";
import CapTable from "./cap-table";
import PitchDeck from "./pitch-deck";
import TaxReturn from "./tax-returns";
import FinancialStatement from "./financial-statements";
import OtherDocuments from "./other-documents";
import LegalDocuments from "./legal-documents";

type Props = { 
    investorId: number 
    startupId: number
}

const FinancialDetails = ({ investorId, startupId }: Props) => {

    const [activeTab, setActiveTab] = useState<string>("capTable");
    const [status, setStatus] = useState<"PENDING" | "APPROVED">("PENDING");
    const [isContentVisible, setIsContentVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    const tabs = [
        { key: "capTable", label: "Cap Table" },
        { key: "pitchDeck", label: "Pitch Deck" },
        { key: "taxReturn", label: "Tax Returns" },
        { key: "financialStatement", label: "Financials" },
        { key: "legalDocuments", label: "Legal" },
        { key: "otherDocument", label: "Others" },
    ];

    useEffect(() => {
        const fetchFinancialDetails = async () => {
            try {
                const financialDetailRequest = await getFinancialDetailsRequests(investorId, startupId);
            
                const newStatus = 
                    financialDetailRequest.length === 0 || !financialDetailRequest.some(req => req.accepted)
                    ? "PENDING"
                    : "APPROVED";

                setStatus(newStatus);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }            
        };

        fetchFinancialDetails();
    }, [investorId, startupId]);

    const toggleContentVisibility = () => {
        setIsContentVisible(prevState => !prevState);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center bg-[#313131] p-4 rounded-[4px]">
                <Loader2 size={24} className="animate-spin text-white" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 items-center bg-[#313131] p-4 rounded-[4px]">
            <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-2 text-white">
                    <span>Financial details</span>
                    <span className={`text-xs px-2 py-1 rounded-[4px] ${status === "PENDING" ? "bg-orange-500" : "bg-green-500"}`}>
                        {status}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button 
                        className="border border-white text-white px-4 py-2 rounded-[4px] flex items-center gap-2"
                        onClick={toggleContentVisibility}
                    >
                        <Eye size={16} /> <span>View</span>
                    </button>
                </div>
            </div>

            {isContentVisible && (
                <div className="flex flex-col w-full">
                    <div className="flex gap-2 mb-4">
                        {tabs.map(tab => (
                        <button
                            key={tab.key}
                            className={`px-2 py-2 text-base font-semibold ${
                            activeTab === tab.key ? " text-orange-500" : "text-gray-200"
                            }`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                        ))}
                    </div>

                    <section className="w-full">
                        {activeTab === "pitchDeck" && <PitchDeck investorId={investorId} startupId={startupId} />}
                        {activeTab === "capTable" && <CapTable investorId={investorId} startupId={startupId} />}
                        {activeTab === "taxReturn" && <TaxReturn investorId={investorId} startupId={startupId} />}
                        {activeTab === "financialStatement" && <FinancialStatement investorId={investorId} startupId={startupId} />}
                        {activeTab === "legalDocuments" && <LegalDocuments investorId={investorId} startupId={startupId} />}
                        {activeTab === "otherDocument" && <OtherDocuments investorId={investorId} startupId={startupId} />}
                    </section>
                </div>
            )}
        </div>
    );
};

export default FinancialDetails;