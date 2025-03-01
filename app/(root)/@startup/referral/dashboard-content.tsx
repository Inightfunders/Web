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
    <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto space-y-6 my-8 max-w-[1800px]">
    {/* Top Section */}
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left Stats */}
      <div className="flex flex-col w-full md:w-1/3 space-y-4">
        <div className="p-4 bg-[#212121] rounded-lg text-center">
          <DashboardCard title="Invites" value="1200" />
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
      {/* Right Section */}
      <div className="w-full md:w-2/3">
        <Shareable />
      </div>
    </div>
    {/* Recent Referral Status */}
    <div className="mt-8 flex items-center justify-between">
      <p className="text-white text-lg">Recent referral status</p>
      <p className="text-[#FF7A00] text-sm underline cursor-pointer">See all</p>
    </div>
    {/* Table */}
    <div className="overflow-x-auto bg-[#FAFAFA] rounded-lg mt-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="p-3">Serial Number</th>
            <th className="p-3">Company</th>
            <th className="p-3">Registered</th>
            <th className="p-3">Funding Status</th>
            <th className="p-3">Earnings</th>
          </tr>
        </thead>
        <tbody>
          {lendersData.map((lender, index) => (
            <tr key={index} className="border-t">
              <td className="p-3 text-center">{lender.serial_number}</td>
              <td className="p-3">{lender.company}</td>
              <td className="p-3">
                <span className={`px-3 py-1 rounded-full text-white text-xs ${lender.registered === "Yes" ? "bg-green-600" : lender.registered === "Pending" ? "bg-yellow-500" : "bg-red-600"}`}>
                  {lender.registered}
                </span>
              </td>
              <td className="p-3">
                <span className={`px-3 py-1 rounded-full text-white text-xs ${lender.funding_status === "Completed" ? "bg-green-600" : lender.funding_status === "Pending" ? "bg-yellow-500" : "bg-red-600"}`}>
                  {lender.funding_status}
                </span>
              </td>
              <td className="p-3">{lender.earnings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}
