"use client";

import React, { useEffect, useState } from 'react';
import { FileText, Eye, Download } from "lucide-react";
import { getFinancialDetailsRequests, getNda } from "@/lib/actions/investor";
import { NdaModal } from "@/components/modal/investorModals/ndaModal";
import { Loader2 } from "lucide-react";

type Props = { 
    investorId: number;
    startupId: number;
};

export const NonDisclosure = ({ investorId, startupId }: Props) => {
    const [finDetReq, setFinDetReq] = useState<any>(null);
    const [ndaDoc, setNdaDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ndaStatus, setNdaStatus] = useState(false);

    const documentLink: string = '/NDA.pdf';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const financialDetails = await getFinancialDetailsRequests(investorId, startupId);
                const ndaDocument = await getNda(investorId, startupId);

                setFinDetReq(financialDetails);
                setNdaDoc(ndaDocument);
                setNdaStatus(financialDetails[0]?.nda_status || false);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [investorId, startupId]);

    const handleDownload = (documentLink: string | null) => {
        if (!documentLink) {
            console.error("No document link available");
            return;
        }

        const link = document.createElement('a');
        link.href = documentLink;
        link.setAttribute('download', 'NDA.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleNdaAccepted = () => {
        setNdaStatus(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center bg-[#313131] p-4 rounded-[4px]">
                <Loader2 size={24} className="animate-spin text-white" />
            </div>
        );
    }

    if (!ndaDoc || ndaDoc.length === 0 || !ndaDoc[0].document_link || !ndaDoc[0].name) {
        return <div className="text-white bg-[#313131] py-4">NDA document not available.</div>;
    }

    return (
        <div className="flex justify-between items-center bg-[#313131] p-4 rounded-[4px]">
            <div className="flex items-center gap-2 text-white rounded-[4px]">
                <FileText />
                <span>Non disclosure agreement</span>
                <span className={`text-xs px-2 py-1 rounded-[4px] ${ndaStatus ? "bg-green-500" : "bg-orange-500"}`}>
                    {ndaStatus ? "ACCEPTED" : "PENDING"}
                </span>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setIsModalOpen(true)} className="border border-white text-white px-4 py-2 rounded-[4px] flex items-center gap-2">
                    <Eye size={16} /> <span>View</span>
                </button>
                <button
                    className="border border-white text-white px-4 py-2 rounded-[4px] flex items-center gap-2"
                    onClick={() => handleDownload(documentLink)}
                >
                    <Download size={16} /> <span>Download</span>
                </button>
            </div>

            <NdaModal
              isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
              investorId={investorId} startupId={startupId}
              onNdaAccepted={handleNdaAccepted} requestId={finDetReq[0]?.id}
              documentLink={ndaDoc[0]?.document_link} />
        </div>
    );
};