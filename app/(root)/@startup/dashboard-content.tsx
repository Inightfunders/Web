import React from "react";
import DashboardCard from "./DashboardCard";
import StartUpsInvestors from "@/components/startup/StartUpsInvestors";
import { getUser } from "@/lib/actions/auth";
import { getContracts } from "@/lib/actions/startup";

import CustomStartupChart from "@/components/startup/CustomStartupChart";

export default async function DashboardContent({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const user = await getUser();
  const startupContracts = await getContracts(user?.userStartUp?.id!);

  const totalAmountInvested = startupContracts.acceptedContracts?.reduce(
    (acc, contract) =>
      acc +
      (contract.investment_amount_paid
        ? parseFloat(contract.amount_invested)
        : 0),
    0
  );

  const totalReturnPaid = startupContracts.acceptedContracts?.reduce(
    (acc, contract) =>
      acc +
      (contract.investment_amount_paid && contract.total_return_paid
        ? parseFloat(contract.total_return_paid)
        : 0),
    0
  );

  const availableBalance = startupContracts.acceptedContracts?.reduce(
    (acc, contract) =>
      acc +
      (contract.investment_amount_paid && contract.total_return_paid
        ? parseFloat(contract.amount_invested) -
          parseFloat(contract.total_return_paid)
        : 0),
    0
  );

  const formatCurrency = (value: number) =>
    `$${Intl.NumberFormat("us").format(value)}`;

  return (
    <div className="w-full mx-auto space-y-6 my-8 px-4 sm:px-6 lg:px-8 borrower_dashboard">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Stats */}
        <div className="flex flex-col space-y-6">
          <DashboardCard
            title="Total Funds"
            value={totalAmountInvested ? formatCurrency(totalAmountInvested) : "$0"}
            className="text-center content-center w-full h-full"
          />
          <DashboardCard
            title="Available Balance"
            value={availableBalance ? formatCurrency(availableBalance) : "$0"}
            className="text-center content-center w-full h-full"
          />
        </div>

        {/* Right Chart */}
        <div className="w-full">
          <CustomStartupChart
            totalAmountInvested={totalAmountInvested!}
            availableBalance={availableBalance!}
            totalReturnPaid={totalReturnPaid || 0}
          />
        </div>
      </div>

      {/* Investors Section */}
      <div className="w-full">
        <StartUpsInvestors
          searchParams={searchParams}
          contracts={startupContracts.acceptedContracts!}
        />
      </div>
    </div>
  );
}

