import { getLegalDocuments, getNda } from "@/lib/actions/startup";
import UploadLegalDocuments from "./upload-legal-documents";
import UploadNdaDocuments from "./upload-nda-documents"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LegalDocumentsActionBtns from "./legal-documents-action-btns";
import NdaDocumentsActionBtns from "./nda-action-btns";
import ViewBtn from "./view-btn";
import { formatDate } from "@/lib/utils";

export default async function LegalDocuments() {
  const LegalDocuments = await getLegalDocuments();
  const nda = await getNda();

  return (
    <div className="">
      <section className="flex w-full flex-col gap-4 mt-12">
        <div className="flex items-center justify-between gap-4">
          <p className="font-bold dashboardtablehead   text-white text-xl">
            Legal Documents
          </p>
          <UploadLegalDocuments />
        </div>
        <Table className="bg-white">
          <TableHeader>
            <TableRow className="">
              <TableHead className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext  w-[20px]">
                SN
              </TableHead>
              <TableHead className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                Document Name
              </TableHead>
              <TableHead className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                First Update
              </TableHead>
              <TableHead className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                Last modified
              </TableHead>
              <TableHead className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LegalDocuments?.map((LegalDocuments, index) => (
              <TableRow key={LegalDocuments.id}>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]    w-[100px]">
                  { index + 1 }
                </TableCell>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                  {LegalDocuments.name}
                </TableCell>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                  {formatDate(new Date(LegalDocuments?.created_at!))}
                </TableCell>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                  {formatDate(new Date(LegalDocuments?.updated_at!))}
                </TableCell>
                <TableCell className="flex items-center justify-center gap-3 p-6 text-center border-[#EAEAEA]   ">
                  <LegalDocumentsActionBtns
                    document_link={LegalDocuments.document_link!}
                    legalDocumentsId={LegalDocuments.id!}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      <section className="flex w-full flex-col gap-4 mt-12">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-start">
            <p className="font-bold dashboardtablehead   text-white text-xl">
              NDA
            </p>
            {/* <p className="text-white text-sm">All users onboarding the Insight Funders platform are required to sign a master NDA. However, if you have an additional NDA that you would like the lender to sign before granting access to your data, please upload it here.</p> */}
          </div>
          <UploadNdaDocuments />
        </div>
        <Table className="bg-white">
          <TableHeader>
            <TableRow className="">
              <TableHead className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext  w-[20px]">
                SN
              </TableHead>
              <TableHead className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                Document Name
              </TableHead>
              <TableHead className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                First Update
              </TableHead>
              <TableHead className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                Last modified
              </TableHead>
              <TableHead className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nda?.map((nda, index) => (
              <TableRow key={nda.id}>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]    w-[100px]">
                  { index + 1 }
                </TableCell>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                  {nda.name}
                </TableCell>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                  {formatDate(new Date(nda?.created_at!))}
                </TableCell>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                  {formatDate(new Date(nda?.updated_at!))}
                </TableCell>
                <TableCell className="flex items-center justify-center gap-3 p-6 text-center border-[#EAEAEA]   ">
                  <NdaDocumentsActionBtns
                    document_link={nda.document_link!}
                    ndaId={nda.id!}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
