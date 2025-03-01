import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { Card } from "@/components/ui/card";

import StartUpsInvestors from "@/components/startup/StartUpsInvestors";
import { getContracts } from "@/lib/actions/startup";
import StartUpsChart from "@/components/startup/StartUpsChart";
import { SearchInput } from "@/components/lenders/SearchInput";
import { Search } from "lucide-react";
import { CustomSearch } from "@/components/lenders/CustomSearch";
import CustomStartupChart from "@/components/startup/CustomStartupChart";
import DashboardCard from "../../@startup/DashboardCard";
import Shareable from "./Shareable";
import { getUser } from "@/lib/actions/auth";
import { getReferredUsers } from "@/lib/actions/auth";

interface LenderData {
  serial_number: number;
  date: string;
  amount: string;
  status: "Completed" | "Pending" | "NO";
  payment_method: string;
}

export default async function DashboardContent({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const lendersData: LenderData[] = [
    {
      serial_number: 1,
      date: "01/01/2024",
      amount: "$200",
      status: "Completed",
      payment_method: "Card",
    },
    {
      serial_number: 1,
      date: "01/01/2024",
      amount: "$200",
      status: "Pending",
      payment_method: "Card",
    },
    {
      serial_number: 1,
      date: "01/01/2024",
      amount: "$200",
      status: "NO",
      payment_method: "Paypal",
    },
    {
      serial_number: 1,
      date: "01/01/2024",
      amount: "$200",
      status: "NO",
      payment_method: "Stripe",
    },
    {
      serial_number: 1,
      date: "01/01/2024",
      amount: "$200",
      status: "NO",
      payment_method: "Paypal",
    },
    {
      serial_number: 1,
      date: "01/01/2024",
      amount: "$200",
      status: "NO",
      payment_method: "Card",
    },
  ];

  const userData = await getUser();
    const users = await getReferredUsers(userData?.user?.user_metadata?.sub );
    const refUser = users.statuses ?? [];

    const TotalEarning = refUser.reduce((acc, user)=>user?.earnings > 0 && user.accepted ? acc+=user?.earnings : acc, 0);

  return (
    <div
      className="w-full mx-auto space-y-6 my-8
      max-w-[800px]                     
      lg:max-w-[850px]                 
      xl:max-w-[923px]                  
      2xl:max-w-[1200px]               
      3xl:max-w-[1700px]              
      4xl:max-w-[1800px]"
    >
      {/* Top Section */}
      <div className="flex gap-[21px]">
        {/* Left Stats */}
        <div className="flex flex-col justify-between space-y-[20px] min-w-[332px]">
          <DashboardCard
            title="Invites"
            value={refUser.length}
            className="h-[calc(50%-12px)] text-center content-center"
          />
          <div
            className={`p-4 bg-[#212121] rounded-[8px] h-[calc(50%-12px)] text-center content-center items-center`}
          >
            <p className="text-white text-xs mb-[12px] font-Montserrat leading-[14px]">
              Earnings 
            </p>
            <p className="text-white text-xl font-[700] font-Montserrat leading-[22px] mt-3 pb-[12px]">
              ${TotalEarning}
            </p>
            <div className="w-full justify-items-center">
              <button
                type="button"
                className="flex  font-semibold text-[14px] rounded-[8px] items-center gap-[10px] bg-[#FF7A00] text-[#ffffff] py-[10px] px-[18px]"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>

        <div className="w-full">
          <Shareable />
        </div>
      </div>

      <div className="mt-[30px] flex items-center justify-between">
        <p className="text-[#ffffff] font-normal text-[20px] ">
          Recent withdraws
        </p>
        <p className="text-[#FF7A00] font-normal text-[16px] underline">
          See all
        </p>
      </div>

      <div className="overflow-x-auto bg-[#FAFAFA] rounded-lg !mt-[30px]">
        <table className="w-full">
          <thead>
            <tr className="text-sm">
              <th className="text-[12px] w-[130px] text-left p-[22px] font-medium font-Montserrat text-[#1A1A1A] leading-[14px] whitespace-nowrap">
                Serial number
              </th>
              <th className="text-[12px] w-[200px] text-left p-[22px] font-medium font-Montserrat text-[#1A1A1A] leading-[14px]">
                Date
              </th>
              <th className="text-[12px] w-[300px] text-left p-[22px] font-medium font-Montserrat text-[#1A1A1A] leading-[14px]">
                Amount
              </th>
              <th className="text-[12px] text-left p-[22px] font-medium font-Montserrat text-[#1A1A1A] leading-[14px]">
                Status
              </th>
              <th className="text-[12px] text-left p-[22px] font-medium font-Montserrat text-[#1A1A1A] leading-[14px]">
                Payment method
              </th>
            </tr>
          </thead>
          <tbody>
            {lendersData.map((lender, index) => (
              <tr key={index}>
                <td
                  className={`p-[22px] bg-[#EAEAEA] font-Montserrat text-center text-[13px]`}
                >
                  {lender.serial_number}
                </td>
                <td
                  className={`p-[22px] bg-[#FEFFFE] font-Montserrat text-left text-[12px]`}
                >
                  {lender.date}
                </td>
                <td
                  className={`p-[22px] bg-[#EAEAEA] font-Montserrat text-left text-[13px]`}
                >
                  {lender.amount}
                </td>
                <td
                  className={`p-[22px] bg-[#FEFFFE] font-Montserrat text-left text-[13px]`}
                >
                  {lender.status === "Completed" && (
                    <div className="bg-[#008802] w-fit py-[4px] px-[8px] rounded-[42px] text-[#ffffff] text-[12px]">
                      {lender.status}
                    </div>
                  )}
                  {lender.status === "Pending" && (
                    <div className="bg-[#CC9900] w-fit py-[4px] px-[8px] rounded-[42px] text-[#ffffff] text-[12px]">
                      {lender.status}
                    </div>
                  )}
                  {lender.status === "NO" && (
                    <div className="bg-[#D80000] w-fit py-[4px] px-[8px] rounded-[42px] text-[#ffffff] text-[12px]">
                      {lender.status}
                    </div>
                  )}
                </td>
                <td
                  className={`p-[22px] bg-[#EAEAEA] font-Montserrat text-left text-[13px]`}
                >
                  {lender.payment_method}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
