import { getFinancialRounds } from "@/lib/actions/startup";
import { cn } from "@/lib/utils";

export default async function FinancialRounds({
  startupId,
}: {
  startupId: number;
}) {
  const financialRounds = await getFinancialRounds(startupId);

  return (
    <div className="w-full overflow-auto bg-white rounded-md">
      <div className="grid grid-cols-4 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 p-4 bg-gray-100 font-medium text-xs md:text-sm shadow-xl">
        <p className="text-center">Investor</p>
        <p className="text-center">Round</p>
        <p className="text-center">Date</p>
        <p className="text-center">Amount</p>
      </div>

      {financialRounds.length > 0 ? (
        financialRounds.map((financialRound, index) => (
          <div
            key={index}
            className={cn(
              "grid grid-cols-4 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-2 ",
              index % 2 !== 0 ? "bg-gray-200" : "bg-white"
            )}
          >
            <div className="text-center text-sm p-2">
              {financialRound.investor}
            </div>
            <div className="text-center text-sm p-2 bg-[#B4B4B4CC]">
              {financialRound.round}
            </div>
            <div className="text-center text-sm p-2">{financialRound.date}</div>
            <div className="text-center text-sm p-2 bg-[#B4B4B4CC]">
              ${financialRound.amount}
            </div>
          </div>
        ))
      ) : (
        <p className="flex items-center justify-center my-12 text-center">
          No Data Yet!
        </p>
      )}
    </div>
  );
}
