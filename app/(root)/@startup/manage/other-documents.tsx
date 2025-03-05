import { getOtherDocuments } from "@/lib/actions/startup";
import UploadOtherDocuments from "./upload-other-documents";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OtherDocumentsActionBtns from "./other-documents-action-btns";
import ViewBtn from "./view-btn";
import { formatDate } from "@/lib/utils";

export default async function OtherDocuments() {
  const Others = await getOtherDocuments();

  return (
    <section className="flex w-full flex-col gap-4 mt-12">
      <div className="flex items-center justify-between gap-4">
        <p className="font-bold dashboardtablehead   text-white text-xl">
          Other documents
        </p>
        <UploadOtherDocuments />
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
          {Others?.map((Others, index) => (
            <TableRow key={Others.id}>
              <TableCell className="px-1 border-2 text-center border-[#EAEAEA] w-[100px]">
                {/* <ViewBtn
                  document_link={Others.document_link!}
                  type="otherDocuments"
                /> */}
                { index + 1 }
              </TableCell>
              <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                {Others.name}
              </TableCell>
              <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                {formatDate(new Date(Others?.created_at!))}
              </TableCell>
              <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                {formatDate(new Date(Others?.updated_at!))}
              </TableCell>
              <TableCell className="flex items-center justify-center gap-3 p-6 text-center border-[#EAEAEA]   ">
                <OtherDocumentsActionBtns
                  document_link={Others.document_link!}
                  otherDocumentsId={Others.id!}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
