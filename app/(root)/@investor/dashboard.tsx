import InvestorsChart from "@/components/investors/InvestorsChart";
import InvestorsStartups from "@/components/investors/InvestorsStartups";
import { getUser } from "@/lib/actions/auth";
import { getContracts } from "@/lib/actions/investor";
// import StartUpsChart from "@/components/startup/StartUpsChart";
import { CustomSearch } from "@/components/lenders/CustomSearch";
import InvestorDashboardCard from "@/components/investors/investorDashboardCard";
import PayNow from "@/components/investors/PayNow";
import { getNextDueDate } from "@/lib/utils";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const user = await getUser();

  const investorContracts = await getContracts(user?.userInvestor?.id!);
  // console.log("investorContracts", investorContracts);

  // await new Promise(resolve => setTimeout(resolve, 10000))
  const formatCurrency = (value: number) =>
    `$${Intl.NumberFormat("us").format(value)}`;

  const totalAmountInvested = investorContracts.acceptedContracts?.reduce(
    (acc, contract) =>
      acc +
      (contract.investment_amount_paid
        ? parseFloat(contract.amount_invested)
        : 0),
    0
  );
  const totalROI = investorContracts.acceptedContracts?.reduce(
    (acc, contract) =>
      acc +
      (contract.investment_amount_paid
        ? parseFloat(contract.amount_invested) *
          ((parseFloat(contract.interest_rate ?? "0") + 100) / 100)
        : 0),
    0
  );
  const totalStartups = investorContracts.acceptedContracts?.filter(
    (contract) => contract.investment_amount_paid
  ).length;

  // console.log({ totalAmountInvested, totalROI, totalStartups });

  return (
    <div className="w-full mx-auto space-y-6 my-4 max-w-[90%]">
    {/* Stats Section */}
    <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
      {/* Left Column - Stats */}
      <div className="flex flex-col w-full lg:w-auto space-y-4 min-w-full lg:min-w-[332px] mt-5 sm:mt-10 max-md:mt-16 md:mt-16">

        <InvestorDashboardCard
          title="Total Investment"
          value={formatCurrency(totalAmountInvested!)}
          className="text-center content-center"
        />
        <InvestorDashboardCard
          title="Total Expected Return"
          value={formatCurrency(Number(totalROI?.toFixed(2)))}
          className="text-center content-center"
        />
        <InvestorDashboardCard
          title="Companies Invested"
          value={totalStartups!}
          className="text-center content-center"
        />
      </div>
  
      {/* Right Column - Chart */}
      <div className="w-full">
        <InvestorsChart
          contracts={investorContracts.acceptedContracts!}
          totalROI={totalROI!}
        />
      </div>
    </div>
  
    {/* Search Bar */}
    <div className="relative w-full">
      <CustomSearch
        placeholder="Search startups"
        className="pl-10 bg-white border border-gray-300 text-gray-800 font-Montserrat w-full py-2 rounded-md"
      />
    </div>
  
    {/* Responsive Table */}
    <div className="overflow-auto bg-[#FAFAFA] rounded-lg">
      <table className="w-full min-w-full">
        <thead>
          <tr className="text-[#1A1A1A] text-sm leading-[15px] text-[12px]">
            <th className="text-[12px] text-center p-4 font-medium font-Montserrat">
              Company Name
            </th>
            <th className="text-[12px] text-center p-4 font-medium font-Montserrat">
              Amount Invested
            </th>
            <th className="text-[12px] text-center p-4 font-medium font-Montserrat">
              APY
            </th>
            <th className="text-[12px] text-center p-4 font-medium font-Montserrat">
              Term
            </th>
            <th className="text-[12px] text-center p-4 font-medium font-Montserrat">
              Maturity Date
            </th>
            <th className="text-[12px] text-center p-4 font-medium font-Montserrat">
              Due Payment Date
            </th>
          </tr>
        </thead>
        <tbody>
          {investorContracts?.acceptedContracts?.map((company, index) => (
            <tr key={index} className="text-center">
              <td className="p-4 bg-[#EAEAEA] font-Montserrat">
                <div>
                  <div className="font-medium text-[13px] leading-[15px]">
                    {company.company_name}
                  </div>
                  <div className="text-sm text-gray-500 text-[13px]">
                    {company.industry_sector}
                  </div>
                </div>
              </td>
              <td className="p-4 bg-white font-Montserrat text-[13px] leading-[15px] text-[#1A1A1A]">
                {company.investment_amount_paid
                  ? `${parseFloat(company.amount_invested).toLocaleString()}`
                  : <PayNow contractId={company.id} />}
              </td>
              <td className="p-4 bg-[#EAEAEA] font-Montserrat text-[13px] leading-[15px] text-[#1A1A1A]">
                {company.interest_rate}
              </td>
              <td className="p-4 bg-white font-Montserrat text-[13px] leading-[15px] text-[#1A1A1A]">
                {company.payment_interval}
              </td>
              <td className="p-4 bg-[#EAEAEA] font-Montserrat text-[13px] leading-[15px] text-[#1A1A1A]">
                {company.maturity_date}
              </td>
              <td className="p-4 bg-white font-Montserrat text-[13px] leading-[15px] text-[#1A1A1A]">
                {getNextDueDate(new Date(company.createdAt!), company.payment_interval!).toDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
  );
}
