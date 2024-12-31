"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

type Props = {
  totalAmountInvested: number;
  totalROI: number;
  availableBalance: number;
};

export default function StartUpsChart({
  totalAmountInvested,
  totalROI,
  availableBalance,
}: Props) {
  const realizedTotal = totalAmountInvested + totalROI;
  const total = realizedTotal - totalAmountInvested;

  console.log({ totalAmountInvested, totalROI });

  const data = [
    {
      name: "Available Balance",
      value: realizedTotal,
      percentage:
        totalAmountInvested > 0
          ? Math.round((realizedTotal / totalAmountInvested) * 100)
          : 0,
      fill: "#FF7A00",
    },
    {
      name: "Funds Used",
      value: totalAmountInvested,
      percentage:
        totalAmountInvested > 0
          ? Math.round((totalAmountInvested / totalAmountInvested) * 100)
          : 0,
      fill: "#5631CC",
    },
  ];

  const chartConfig = {
    availableBalance: {
      label: "Available Balance",
      color: "#5631CC",
    },
    fundsUsed: {
      label: "Funds Used",
      color: "#FF7A00",
    },
  } satisfies ChartConfig;

  const valueFormatter = (value: any, name: any) => {
    if (name === "No Data Available") {
      return "No Data Available $0";
    }
    return `$ ${Intl.NumberFormat("us").format(value).toString()}`;
  };

  const formatCurrency = (value: number) =>
    `$${Intl.NumberFormat("us").format(value)}`;

  return (
    <Card className="bg-[#212121] border-none rounded-[8px] text-white">
      <CardHeader className="pb-0">
        <CardTitle className="text-base text-left leading-[20px] font-normal font-Montserrat">
          Total return on Investment
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center gap-12 z-50">
          <ChartContainer config={chartConfig} className="w-[212px] h-[200px]">
            <PieChart width={200} height={200}>
              <ChartTooltip
                content={<ChartTooltipContent formatter={valueFormatter} />}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                strokeWidth={2}
                stroke="hsl(var(--background))"
                label={({ payload }) => `${payload.percentage}%`}
                labelLine={false}
              />
            </PieChart>
          </ChartContainer>

          <div className="flex flex-col gap-3 pt-4">
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF7A00]" />
                <span className="text-[13px] font-Montserrat leading-[15px]">
                  Realized Return
                </span>
              </div>
              <span className="text-[13px] font-Montserrat leading-[15px]">
                {formatCurrency(realizedTotal)}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2  break-words">
                <div className="w-3 h-3 rounded-full bg-[#EAEAEA]" />
                <span className="text-[13px] font-Montserrat text-left leading-[15px]">
                  Remaining
                  <br />
                  Return Expected
                </span>
              </div>
              <span className="text-[13px] font-Montserrat leading-[15px]">
                {formatCurrency(availableBalance)}
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <div className="flex justify-between items-center gap-4">
                <span className="text-[13px] font-bold font-Montserrat">
                  Total ROI
                </span>
                <span className="text-[13px] font-bold font-Montserrat">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
