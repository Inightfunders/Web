'use client'
import { TrendingUp } from "lucide-react"
import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart"
  import Highcharts from "highcharts";
  import Highcharts3D from "highcharts/highcharts-3d";
  import HighchartsReact from "highcharts-react-official";
type Props = {
    contracts: {
        id: number;
        payment_interval: "week" | "month" | "quarter" | "year" | null;
        investor_id: number;
        accepted: boolean;
        startup_id: number;
        amount_invested: string;
        interest_rate: string | null;
        total_return_paid: string | null;
        maturity_date: string | null;
    }[]
    totalROI: number;
}

export default function InvestorsChart({ contracts, totalROI }: Props)
{
    const officialReturn = useMemo(() => {
        return contracts.reduce((acc, contract) => acc + (parseFloat(contract.total_return_paid ?? '0')), 0)
    }, [contracts])

    const expectedReturn = useMemo(() => {
        return totalROI - officialReturn
    }, [officialReturn, totalROI])
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
          height: 200,
          width: 300,
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
              enabled: true,
              format: "<b>{point.percentage:.0f}%</b>",
              distance: -50,
              style: {
                color: "#fff",
                textShadow: "2px 2px 4px rgba(199, 196, 196, 0.8)",
                fontSize: "16px",
                fontWeight: "bold",
              },
            },
            showInLegend: false, // ✅ Remove legend if needed
          },
        },
        series: [
          {
            name: "Returns",
            data: [
              {
                name: "Return",
                y: officialReturn,
                color: "#616161",
              },
              {
                name: "Expected Return",
                y: expectedReturn,
                color: "#C4C4C4",
              },
            ],
          },
        ],
      };
    
    const chartData = useMemo(() => {
        return [
            { type: 'Return', value: officialReturn, fill: '#616161' },
            { type: 'Expected Return', value: expectedReturn, fill: '#fff' }
        ]
    }, [officialReturn, totalROI])

    const chartConfig = {
        value: {
            label: 'Amount'
        },
        Return: {
            label: 'Return',
            color: '#616161'
        },
        ExpectedReturn: {
            label: 'Expected Return',
            color: '#fff',
        }
    } satisfies ChartConfig

    return (
        <div className="bg-[#212121] whiteText md:flex">
           {/* Highcharts Pie Chart */}
      <div className="w-[250px] h-[250px]">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
            <div className='flex-[0.65] flex flex-col items-start justify-center gap-4 pl-12'>
                <div className="flex items-center justify-between gap-2 min-w-[200px]">
                    <div className='w-4 h-4 bg-[#616161] rounded-full' />
                    <p className='text-xs font-Montserrat font-light text-left flex-1'>Return</p>
                    <p className='text-xs font-Montserrat font-light text-left flex-[0.5]'>${officialReturn}</p>
                </div>
                <div className="flex items-center justify-between gap-2 min-w-[200px]">
                    <div className='w-4 h-4 bg-[#C4C4C4] rounded-full' />
                    <p className='text-xs font-Montserrat font-light text-left flex-1'>Expected Return</p>
                    <p className='text-xs font-Montserrat font-light text-left flex-[0.5]'>${expectedReturn}</p>
                </div>
                <div className="flex items-center justify-between gap-2 py-2.5 border-t border-[#C4C4C4] min-w-[200px]">
                    <div className='w-4 h-4 bg-transparent rounded-full' />
                    <p className='text-xs font-Montserrat font-light text-left flex-1'>Total</p>
                    <p className='text-xs font-Montserrat font-light text-left flex-[0.5]'>${totalROI}</p>
                </div>
            </div>
        </div>
    )
}