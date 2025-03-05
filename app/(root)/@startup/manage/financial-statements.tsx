import { getFinancialStatements, getFinancialProjection, getBankStatements } from "@/lib/actions/startup";
import UploadFinancialStatements from "./upload-financial-statements";
import UploadFinancialProjection from "./upload-financial-projection";
import UploaBankStatementDocuments from "./upload-bank-statements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FinancialStatementsActionBtns from "./financial-statements-action-btns";
import FinancialProjectionActionBtns from "./financial-projection-action-btns"
import BankStatementActionBtns from "./bank-statement-action-btns";
import { formatDate } from "@/lib/utils";
import ViewBtn from "./view-btn";

export default async function FinancialStatements() {
  const FinancialStatements = await getFinancialStatements();
  const FinancialProjection = await getFinancialProjection();
  const BankStatements = await getBankStatements();

  return (
    <div className="">
      <section className="flex w-full flex-col gap-4 mt-12">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-start">
            <p className="font-bold  dashboardtablehead  text-white text-xl">
              Financial Statements
            </p>
            <p className="text-white text-sm">Last 2-3 years of financial statements</p>
          </div>
          <UploadFinancialStatements />
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
              <TableHead className="px-1 border-2 text-center border-[#EAEAEA]   chartcontenttext">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FinancialStatements?.map((FinancialStatements, index) => (
              <TableRow key={FinancialStatements.id}>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]    w-[100px]">
                  {/* <ViewBtn
                    document_link={FinancialStatements.document_link!}
                    type="financialStatements"
                  /> */}
                  { index + 1 }
                </TableCell>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                  {FinancialStatements.name}
                </TableCell>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                  {formatDate(new Date(FinancialStatements?.created_at!))}
                </TableCell>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                  {formatDate(new Date(FinancialStatements?.updated_at!))}
                </TableCell>
                <TableCell className="flex items-center justify-center gap-3 p-6 text-center border-[#EAEAEA]   ">
                  <FinancialStatementsActionBtns
                    document_link={FinancialStatements.document_link!}
                    financialStatementsId={FinancialStatements.id!}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      <section className="flex w-full flex-col gap-4 mt-12">
        <div className="flex items-center justify-between gap-4">
          <p className="font-bold  dashboardtablehead  text-white text-xl">
            Financial Projection
          </p>
          <UploadFinancialProjection />
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
              <TableHead className="px-1 border-2 text-center border-[#EAEAEA]   chartcontenttext">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FinancialProjection?.map((FinancialProjection, index) => (
              <TableRow key={FinancialProjection.id}>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]    w-[100px]">
                  { index + 1 }
                </TableCell>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                  {FinancialProjection.name}
                </TableCell>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                  {formatDate(new Date(FinancialProjection?.created_at!))}
                </TableCell>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                  {formatDate(new Date(FinancialProjection?.updated_at!))}
                </TableCell>
                <TableCell className="flex items-center justify-center gap-3 p-6 text-center border-[#EAEAEA]   ">
                  <FinancialProjectionActionBtns
                    document_link={FinancialProjection.document_link!}
                    FinancialProjectionId={FinancialProjection.id!}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      <section className="flex w-full flex-col gap-4 mt-12 mb-12">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-start">
            <p className="font-bold  dashboardtablehead  text-white text-xl">
              Bank Statements
            </p>
            <p className="text-white text-sm">Last 12 months of Bank statements</p>
          </div>
          <UploaBankStatementDocuments />
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
              <TableHead className="px-1 border-2 text-center border-[#EAEAEA]   chartcontenttext">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {BankStatements?.map((BankStatements, index) => (
              <TableRow key={BankStatements.id}>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]    w-[100px]">
                  { index + 1 }
                </TableCell>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                  {BankStatements.name}
                </TableCell>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                  {formatDate(new Date(BankStatements?.created_at!))}
                </TableCell>
                <TableCell className="px-1 border-2 text-center border-[#EAEAEA]  chartcontenttext ">
                  {formatDate(new Date(BankStatements?.updated_at!))}
                </TableCell>
                <TableCell className="flex items-center justify-center gap-3 p-6 text-center border-[#EAEAEA]   ">
                  <BankStatementActionBtns
                    document_link={BankStatements.document_link!}
                    bankStatementId={BankStatements.id!}
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
