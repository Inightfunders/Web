"use client";

import { useEffect, useState } from "react";
import { getLegalDocuments, getNda } from "@/lib/actions/investor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Eye, Loader2 } from "lucide-react"

type Props = { 
    investorId: number;
    startupId: number;
}

export default function LegalDocuments({ investorId, startupId }: Props) {
    const [legalDocument, setLegalDocument] = useState<
        {
            id: number;
            name: string | null;
            startup_id: number | null;
            created_at: string;
            document_link: string | null;
            updated_at: string | null;
        }[]
        >([]);

    const [nda, setNda] = useState<
        {
            id: number;
            name: string | null;
            startup_id: number | null;
            created_at: string;
            document_link: string | null;
            updated_at: string | null;
        }[]
        >([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fsData, fpData] = await Promise.all([
                    getLegalDocuments(investorId, startupId),
                    getNda(investorId, startupId),
                ]);

                setLegalDocument(fsData ?? []);
                setNda(fpData ?? []);
            } catch (error) {
                console.error("Error fetching financial data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [investorId, startupId]);

    const handleView = (documentLink: string | null) => {
        if (!documentLink) {
            console.error("No document link available");
            return;
        }

        const link = document.createElement('a');
        link.href = documentLink;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      if (loading) {
        return (
          <div className="flex justify-center items-center">
              <Loader2 size={24} className="animate-spin text-white" />
          </div>
        );
      }

    return (
        <div>
            <TableSection title="Legal Document" data={legalDocument} handleView={handleView} />
            
            <TableSection title="NDA" data={nda} handleView={handleView} />
        </div>
    );
}

const TableSection = ({ title, data, handleView }: { title: string; data: any[]; handleView: (documentLink: string | null) => void; }) => (
    <section className="flex w-full flex-col gap-4">
        <h2 className="text-md text-left text-white">{title}</h2>
        <Table className="bg-white mb-6">
            <TableHeader>
                <TableRow>
                    <TableHead className="px-1 border-2 text-center border-[#EAEAEA]">SN</TableHead>
                    <TableHead className="px-1 border-2 text-center border-[#EAEAEA]">Document Name</TableHead>
                    <TableHead className="px-1 border-2 text-center border-[#EAEAEA]">First Update</TableHead>
                    <TableHead className="px-1 border-2 text-center border-[#EAEAEA]">Last modified</TableHead>
                    <TableHead className="px-1 border-2 text-center border-[#EAEAEA]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell className="px-1 border-2 text-center border-[#EAEAEA]">{index + 1}</TableCell>
                            <TableCell className="px-1 border-2 text-center border-[#EAEAEA]">{item.name}</TableCell>
                            <TableCell className="px-1 border-2 text-center border-[#EAEAEA]">
                                {formatDate(new Date(item.created_at))}
                            </TableCell>
                            <TableCell className="px-1 border-2 text-center border-[#EAEAEA]">
                                {formatDate(new Date(item.updated_at))}
                            </TableCell>
                            <TableCell className="flex items-center justify-center gap-3 p-6 text-center border-[#EAEAEA]">
                                <div className="flex justify-center">
                                    <Eye onClick={() => handleView(item.document_link)} className='cursor-pointer' size={24} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">No data available</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </section>
);
