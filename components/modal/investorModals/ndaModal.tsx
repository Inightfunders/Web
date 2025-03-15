"use client";

import React from 'react'
import { acceptNda } from "@/lib/actions/investor";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

interface ndaModalProps {
    isOpen: boolean;
    onClose: () => void;
    investorId: number;
    startupId: number;
    requestId: number;
    onNdaAccepted: () => void;
    documentLink: string | null;
}

export const NdaModal = ({ isOpen = false, onClose, investorId, startupId, requestId, onNdaAccepted, documentLink }: ndaModalProps) => {
    if (!isOpen) return null;

    const handleAcceptNda = async () => {
      try {
          await acceptNda(investorId, requestId);
          onNdaAccepted();
          onClose();
      } catch (error) {
          console.error("Error accepting NDA:", error);
      }
    };
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl !h-3/4 py-8 relative financial_detail_button">
        <div className="flex items-center justify-between">
          <span className='text-lg font-semibold'>Non Disclosure Agreement</span>
          <span className='cursor-pointer text-gray-500 text-lg font-medium' onClick={onClose}>x</span>
        </div>
        <div className="w-full h-3/4 my-8">
        { documentLink ? (
          <Worker workerUrl="/pdfjs/pdf.worker.min.js">
            <Viewer fileUrl={documentLink} />
          </Worker>
        ) : (<p className="text-center">NDA document not available</p>) }
        </div>
        <div className="flex gap-4 items-center justify-end">
            <button onClick={onClose} className='px-2 py-1 rounded-lg bg-orange-400 text-white'>Disagree</button>
            <button onClick={handleAcceptNda} className='px-2 py-1 rounded-lg bg-green-400 text-white'>I agree</button>
        </div>
      </div>
    </div>
  )
}
