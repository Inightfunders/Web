"use client";

import Highcharts from "highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import HighchartsReact from "highcharts-react-official";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

// ✅ Initialize Highcharts 3D properly
if (typeof Highcharts3D === "function") {
  Highcharts3D(Highcharts);
}

type Props = {
  totalAmountInvested: number;
  availableBalance: number;
  totalReturnPaid: number;
};

export default function CustomStartupChart({
  totalAmountInvested,
  availableBalance,
  totalReturnPaid,
}: Props) {
  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
        depth: 50,
        viewDistance: 25,
      },
      height:200,
      width:300,
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false, // ✅ Disables the Highcharts watermark
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        depth: 50, // 3D depth
        size: "100%",
        dataLabels: {
          enabled: true, // ✅ Keep percentage but remove lines
          format: "<b>{point.percentage:.0f}%</b>",
          distance: -50, // ✅ Move labels inside the chart
          style: {
            color: "#fff",
            textShadow: "2px 2px 4px rgba(199, 196, 196, 0.8)", // ✅ Added Shadow Effect
            fontSize: "16px",
            fontWeight: "bold",
          },
        },
        showInLegend: false, // ✅ Remove legend if needed
      },
    },
    series: [
      {
        name: "Funds",
        data: [
          {
            name: "Available Balance",
            y: totalReturnPaid,
            color: "#5631CC",
          },
          {
            name: "Funds Used",
            y: availableBalance,
            color: "#FF7A00",
          },
        ],
      },
    ],
  };

  return (
    <Card className="bg-[#212121] border-none rounded-[8px] text-white">
      <CardHeader className="pb-0">
        <CardTitle className="text-base text-left leading-[20px] font-normal font-Montserrat">
          Total Funds Available
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center gap-12 data-room-pieChart">
          <div className="w-[250px] h-[250px]">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF7A00]" />
                <span className="text-[13px] font-Montserrat leading-[15px]">
                  Funds Used
                </span>
              </div>
              <span className="text-[13px] font-Montserrat leading-[15px]">
              ${totalReturnPaid.toLocaleString()}
               
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#5631CC]" />
                <span className="text-[13px] font-Montserrat leading-[15px]">
                  Available Balance
                </span>
              </div>
              <span className="text-[13px] font-Montserrat leading-[15px]">
                ${availableBalance.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <div className="flex justify-between items-center gap-4">
                <span className="text-[13px] font-bold font-Montserrat">
                Total Funds Available
                </span>
                <span className="text-[13px] font-bold font-Montserrat">
                ${totalAmountInvested.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
