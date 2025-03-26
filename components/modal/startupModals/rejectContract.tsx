"use client";

import React from 'react'
import { Dialog, DialogContent } from "../../ui/dialog";

interface StartupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmReject: () => void;
}

export const RejectContractModal = ({ isOpen = false, onClose, onConfirmReject }: StartupModalProps) => {
    if (!isOpen) return null;

  return (
    <>
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex flex-col p-4 pt-4 gap-4 items-center justify-center bg-white font-Montserrat !rounded-[8px]">
                <div className="text-lg font-semibold my-8">Are you sure you want to reject this offer?</div>
                <div className="w-full flex justify-between">
                    <button onClick={onClose} className='border-2 border-black font-medium py-2 px-4 rounded-xl'>No, Go back</button>
                    <button onClick={onConfirmReject} className='bg-orange-500 text-white py-2 px-4 rounded-xl'>Confirm</button>
                </div>
            </DialogContent>
        </Dialog>
    </>
  )
}
