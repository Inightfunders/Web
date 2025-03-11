import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { Card } from "@/components/ui/card";

import StartUpsInvestors from "@/components/startup/StartUpsInvestors";
import { getUser } from "@/lib/actions/auth";
import { addReferral, getContracts } from "@/lib/actions/startup";
import StartUpsChart from "@/components/startup/StartUpsChart";
import { SearchInput } from "@/components/lenders/SearchInput";
import { Search } from "lucide-react";
import { CustomSearch } from "@/components/lenders/CustomSearch";
import { getReferredUsers } from "@/lib/actions/auth";
import CustomStartupChart from "@/components/startup/CustomStartupChart";
import Shareable from "./Shareable";
import DashboardCard from "../DashboardCard";

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

  const userData = await getUser();
  const users = await getReferredUsers(userData?.user?.user_metadata?.sub );
  const refUser = users.statuses ?? [];
  // const refdata = await addReferral(
  //   120, 
  //   "f0c802f5-ed1f-472e-9b9f-8db852d4816e", 
  //   800000 
  // ); 
  // console.log("refdata", refdata);
  // console.log("users", users.statuses );
  const TotalEarning = refUser.reduce((acc, user)=>user?.earnings > 0 && user.accepted ? acc+=user?.earnings : acc, 0);
  
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto space-y-6 my-8 max-w-[1800px]">
    {/* {/ Top Section /} */}
    <div className="flex flex-col md:flex-row gap-6">
      {/* {/ Left Stats /} */}
      <div className="flex flex-col w-full md:w-1/3 space-y-4">
        <div className="p-4 bg-[#212121] rounded-lg text-center">
          <DashboardCard title="Invites" value={refUser.length} />
        </div>
        <div
          className={`p-4 bg-[#212121] rounded-[8px] h-[calc(50%-12px)] text-center content-center items-center`}
        >
          <p className="text-white text-xs mb-[12px] font-Montserrat leading-[14px]">
            Earnings
          </p>
          <p className="text-white text-xl font-[700] font-Montserrat leading-[22px] mt-3 pb-[12px]">
           {TotalEarning}
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
          Recent referral status
        </p>
        <p className="text-[#FF7A00] text-sm underline cursor-pointer">
          See all
        </p>
      </div>

      <div className="overflow-x-auto bg-[#FAFAFA] rounded-lg !mt-[30px]">
        <table className="min-w-full">
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
            {refUser.map((user, index) => (
              <tr key={index}>
                <td
                  className={`p-[22px] bg-[#EAEAEA] font-Montserrat text-center text-[13px]`}
                >
                  {index + 1}
                </td>
                <td
                  className={`p-[22px] bg-[#FEFFFE] font-Montserrat text-left text-[12px]`}
                >
                  {user?.company_name}
                </td>
                <td
                  className={`p-[22px] bg-[#EAEAEA] font-Montserrat text-left text-[13px]`}
                >
                  {user?.status === "Registered" && (
                    <div className="bg-[#008802] w-fit py-[4px] px-[8px] rounded-[42px] text-[#ffffff] text-[12px]">
                      {user?.status}
                    </div>
                  )}
                  {user?.status === "Pending" && (
                    <div className="bg-[#CC9900] w-fit py-[4px] px-[8px] rounded-[42px] text-[#ffffff] text-[12px]">
                      {user?.status}
                    </div>
                  )}
                  
                </td>
                <td
                  className={`p-[22px] bg-[#FEFFFE] font-Montserrat text-left text-[13px]`}
                >
                  {user.accepted ===true && (
                    <div className="bg-[#008802] w-fit py-[4px] px-[8px] rounded-[42px] text-[#ffffff] text-[12px]">
                      Accepted
                    </div>
                  )}
                  {user.accepted === false && (
                    <div className="bg-[#CC9900] w-fit py-[4px] px-[8px] rounded-[42px] text-[#ffffff] text-[12px]">
                      Pending
                    </div>
                  )}
                  {user.accepted === undefined && (
                    <div className="bg-[#D80000] w-fit py-[4px] px-[8px] rounded-[42px] text-[#ffffff] text-[12px]">
                      No
                    </div>
                  )}
                </td>
                <td
                  className={`p-[22px] bg-[#EAEAEA] font-Montserrat text-left text-[13px]`}
                >
                 {user?.earnings > 0 && user.accepted ===true  ? user?.earnings : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
