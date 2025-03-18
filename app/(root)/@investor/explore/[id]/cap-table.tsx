"use client";

import { useEffect, useState } from "react";
import { getCapTable } from "@/lib/actions/investor";
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

export default function CapTable({ investorId, startupId }: Props) {
    const [capTable, setCapTable] = useState<
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
        const fetchCapTable = async () => {
          try {
            const data = await getCapTable(investorId, startupId);
            setCapTable(data ?? []);
          } catch (error) {
            console.error("Error fetching pitch deck:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchCapTable();
      }, [investorId, startupId]);

      const handleView = (documentLink: string | null) => {
        if (!documentLink) {
            console.error("No document link available");
            return;
        }
        console.log("documentLink2", documentLink);

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
    <section className="flex w-full flex-col gap-4">
      <Table className="bg-white">
        <TableHeader>
          <TableRow className="">
            <TableHead className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext   w-[20px]">
              SN
            </TableHead>
            <TableHead className=" px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext  ">
              Document Name
            </TableHead>
            <TableHead className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
              First Update
            </TableHead>
            <TableHead className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext">
              Last modified
            </TableHead>
            <TableHead className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {capTable.length > 0 ? capTable?.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="px-1 border-2 text-center border-[#EAEAEA] w-[100px]">
                { index + 1 }
              </TableCell>
              <TableCell className="px-1 border-2 text-center border-[#EAEAEA]   ">
                {item.name}
              </TableCell>
              <TableCell className="px-1 border-2 text-center border-[#EAEAEA]   ">
                {formatDate(new Date(item?.created_at!))}
              </TableCell>
              <TableCell className="px-1 border-2 text-center border-[#EAEAEA]   ">
                {formatDate(new Date(item?.updated_at!))}
              </TableCell>
              <TableCell className="px-1 border-2 text-center border-[#EAEAEA]   ">
                <div className="flex justify-center">
                  <Eye onClick={() => handleView(item.document_link)} className='cursor-pointer' size={24} />
                </div>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">No data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
