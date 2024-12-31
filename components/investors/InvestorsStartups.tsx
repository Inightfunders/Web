import { getStartup } from "@/lib/actions/investor";
import { cn, getNextDueDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Search, Settings2 } from "lucide-react";
import Link from "next/link";
import SearchStartupsBar from "./SearchStartupsBar";
import PayNow from "./PayNow";

type Props = {
  contracts: {
    payment_interval: "week" | "month" | "quarter" | "year" | null;
    id: number;
    investor_id: number;
    accepted: boolean;
    startup_id: number;
    amount_invested: string;
    interest_rate: string | null;
    total_return_paid: string | null;
    maturity_date: string | null;
    investment_amount_paid: boolean | null;
    createdAt: string | null;
  }[];
  searchParams: {
    page?: string;
  };
};

export default async function InvestorsStartups({
  contracts,
  searchParams,
}: Props) {
  const contractsWithStartUps = await Promise.all(
    contracts.map(async (contract) => {
      const startup = await getStartup(contract.startup_id);
      return { ...contract, startup };
    })
  );

  const page = searchParams?.page ? parseInt(searchParams.page) : 1;

  const startIndex = (page - 1) * 5 + 1;
  const endIndex =
    contractsWithStartUps.length >= page * 5
      ? page * 5
      : contractsWithStartUps.length;

  const nextAvailable = endIndex < contractsWithStartUps.length;
  const prevAvailable = page > 1;

  return (
    <div>
      <table className="w-full">
        <thead>
          <tr className="bg-[#FAFAFA] text-sm">
            <th className="text-[12px] text-center p-[22px] font-medium font-Montserrat text-[#1A1A1A] leading-[14px]">
              Name & Startup Details
            </th>
            <th className="text-[12px] text-center p-[22px] font-medium font-Montserrat text-[#1A1A1A] leading-[14px]">
              Amount Invested
            </th>
            <th className="text-[12px] text-center p-[22px] font-medium font-Montserrat text-[#1A1A1A] leading-[14px]">
              Return of Investment
            </th>
            <th className="text-[12px] text-center p-[22px] font-medium font-Montserrat text-[#1A1A1A] leading-[14px]">
              Maturity Date
            </th>
            <th className="text-[12px] text-center p-[22px] font-medium font-Montserrat text-[#1A1A1A] leading-[14px]">
              Due Payment Date
            </th>
          </tr>
        </thead>
        <tbody>
          {contractsWithStartUps.length > 0 ? (
            contractsWithStartUps
              .slice(startIndex - 1, endIndex)
              .map((contract, index) => (
                <tr key={index}>
                  <td className="border-0 p-0 bg-[#EAEAEA] font-Montserrat text-[13px]">
                    <div className="flex-1 flex flex-col items-center justify-center gap-1">
                      <Link
                        href={`/startup/${contract.startup?.id.toString()}`}
                      >
                        <p className="text-sm underline">
                          {contract.startup?.company_name}
                        </p>
                      </Link>
                      <p className="text-xs font-light">
                        {contract.startup?.industry_sector}
                      </p>
                    </div>
                  </td>
                  <td
                    className={`p-[22px] bg-[#FEFFFE] font-Montserrat text-[12px]`}
                  >
                    <div className="flex-1 flex items-center justify-center h-full py-6 gap-2">
                      <span>${contract.amount_invested}</span>
                      {!contract.investment_amount_paid && (
                        <PayNow contractId={contract.id} />
                      )}
                    </div>
                  </td>
                  <td
                    className={`p-[22px] bg-[#EAEAEA] font-Montserrat text-[13px]`}
                  >
                    <div className="flex-1 flex items-center justify-center py-6">
                      {contract.interest_rate}%
                    </div>
                  </td>
                  <td
                    className={`p-[22px] bg-[#FEFFFE] font-Montserrat text-[13px]`}
                  >
                    <div className="flex-1 flex items-center justify-center h-full py-6">
                      {contract.maturity_date}
                    </div>
                  </td>
                  <td
                    className={`p-[22px] bg-[#EAEAEA] font-Montserrat text-[13px]`}
                  >
                    <div className="flex-1 flex items-center justify-center py-6">
                      {getNextDueDate(
                        new Date(contract.createdAt!),
                        contract.payment_interval!
                      ).toDateString()}
                    </div>
                  </td>
                </tr>
              ))
          ) : (
            <p className="min-h-[200px] flex items-center justify-center font-Montserrat">
              No data yet!
            </p>
          )}
        </tbody>
      </table>
      <div className="h-10 flex items-center px-4 justify-between mt-auto">
        <p className="text-xs font-medium">
          Showing {startIndex} - {endIndex}
        </p>
        <div className="flex gap-2">
          <Link
            prefetch={true}
            href={prevAvailable ? `/?page=${page - 1}` : "#"}
          >
            <ChevronLeft
              stroke={prevAvailable ? "#000" : "#00000050"}
              size={16}
            />
          </Link>
          <Link
            prefetch={true}
            href={nextAvailable ? `/?page=${page + 1}` : "#"}
          >
            <ChevronRight
              stroke={nextAvailable ? "#000" : "#00000050"}
              size={16}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
