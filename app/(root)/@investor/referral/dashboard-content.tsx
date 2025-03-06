import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { Card } from "@/components/ui/card";

import StartUpsInvestors from "@/components/startup/StartUpsInvestors";
import { getUser } from "@/lib/actions/auth";
import { getContracts } from "@/lib/actions/startup";
import StartUpsChart from "@/components/startup/StartUpsChart";
import { SearchInput } from "@/components/lenders/SearchInput";
import { Search } from "lucide-react";
import { CustomSearch } from "@/components/lenders/CustomSearch";
import CustomStartupChart from "@/components/startup/CustomStartupChart";
import DashboardCard from "../../@startup/DashboardCard";
import Shareable from "./Shareable";

interface LenderData {
  serial_number: number;
  company: string;
  registered: "Yes" | "Pending" | "NO";
  funding_status: "Completed" | "Pending" | "NO";
  earnings: string;
}

export default async function DashboardContent({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const lendersData: LenderData[] = [
    {
      serial_number: 1,
      company: "John Doe",
      registered: "Yes",
      funding_status: "Completed",
      earnings: "$100",
    },
    {
      serial_number: 1,
      company: "John Doe",
      registered: "Pending",
      funding_status: "Pending",
      earnings: "$100",
    },
    {
      serial_number: 1,
      company: "John Doe",
      registered: "NO",
      funding_status: "NO",
      earnings: "$100",
    },
    {
      serial_number: 1,
      company: "John Doe",
      registered: "NO",
      funding_status: "NO",
      earnings: "$100",
    },
    {
      serial_number: 1,
      company: "John Doe",
      registered: "NO",
      funding_status: "NO",
      earnings: "$100",
    },
    {
      serial_number: 1,
      company: "John Doe",
      registered: "NO",
      funding_status: "NO",
      earnings: "$100",
    },
  ];

  return (
    <div
    className="w-full px-4 sm:px-6 lg:px-8 mx-auto space-y-6 my-8 max-w-[1800px]"
  >
    {/* Top Section */}
    <div className="flex flex-col md:flex-row gap-6 md:mt-4">
      {/* Left Stats */}
      <div className="flex flex-col w-full md:w-1/3 space-y-4">
      <div className="p-4 bg-[#212121] rounded-lg text-center">
        <DashboardCard
          title="Invites"
          value={`1200`}
          className="h-[calc(50%-12px)] text-center content-center"
        />
                </div>
        <div
          className={`p-4 bg-[#212121] rounded-[8px] h-[calc(50%-12px)] text-center content-center items-center`}
        >
          <p className="text-white text-xs mb-[12px] font-Montserrat leading-[14px]">
            Earnings
          </p>
          <p className="text-white text-xl font-[700] font-Montserrat leading-[22px] mt-3 pb-[12px]">
            $6,500
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

    <div className="mt-8 flex items-center justify-between">
      <p className="text-white text-lg">
        Recent withdraws
      </p>
      <p className="text-[#FF7A00] text-sm underline cursor-pointer">
        See all
      </p>
    </div>
  {/* Table */}
      <div className="overflow-x-auto bg-[#FAFAFA] rounded-lg mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="text-[12px] w-[130px] text-left p-[22px] font-medium font-Montserrat text-[#1A1A1A] leading-[14px] whitespace-nowrap">
                Serial number
              </th>
              <th className="text-[12px] text-left p-[22px] font-medium font-Montserrat text-[#1A1A1A] leading-[14px]">
                Company
              </th>
              <th className="text-[12px] text-left p-[22px] font-medium font-Montserrat text-[#1A1A1A] leading-[14px]">
                Registered
              </th>
              <th className="text-[12px] text-left p-[22px] font-medium font-Montserrat text-[#1A1A1A] leading-[14px]">
                Funding Status
              </th>
              <th className="text-[12px] text-left p-[22px] font-medium font-Montserrat text-[#1A1A1A] leading-[14px]">
                Earnings
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
                  {lender.company}
                </td>
                <td
                  className={`p-[22px] bg-[#EAEAEA] font-Montserrat text-left text-[13px]`}
                >
                  {lender.registered === "Yes" && (
                    <div className="bg-[#008802] w-fit py-[4px] px-[8px] rounded-[42px] text-[#ffffff] text-[12px]">
                      {lender.registered}
                    </div>
                  )}
                  {lender.registered === "Pending" && (
                    <div className="bg-[#CC9900] w-fit py-[4px] px-[8px] rounded-[42px] text-[#ffffff] text-[12px]">
                      {lender.registered}
                    </div>
                  )}
                  {lender.registered === "NO" && (
                    <div className="bg-[#D80000] w-fit py-[4px] px-[8px] rounded-[42px] text-[#ffffff] text-[12px]">
                      {lender.registered}
                    </div>
                  )}
                </td>
                <td
                  className={`p-[22px] bg-[#FEFFFE] font-Montserrat text-left text-[13px]`}
                >
                  {lender.funding_status === "Completed" && (
                    <div className="bg-[#008802] w-fit py-[4px] px-[8px] rounded-[42px] text-[#ffffff] text-[12px]">
                      {lender.funding_status}
                    </div>
                  )}
                  {lender.funding_status === "Pending" && (
                    <div className="bg-[#CC9900] w-fit py-[4px] px-[8px] rounded-[42px] text-[#ffffff] text-[12px]">
                      {lender.funding_status}
                    </div>
                  )}
                  {lender.funding_status === "NO" && (
                    <div className="bg-[#D80000] w-fit py-[4px] px-[8px] rounded-[42px] text-[#ffffff] text-[12px]">
                      {lender.funding_status}
                    </div>
                  )}
                </td>
                <td
                  className={`p-[22px] bg-[#EAEAEA] font-Montserrat text-left text-[13px]`}
                >
                  {lender.earnings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
