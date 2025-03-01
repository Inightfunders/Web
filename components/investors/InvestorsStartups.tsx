import { getStartup } from "@/lib/actions/investor";
import { cn, getNextDueDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Search, Settings2 } from "lucide-react";
import Link from "next/link";
import SearchStartupsBar from "./SearchStartupsBar";
import PayNow from "./PayNow";

type Props = {
    contracts: {
        payment_interval: "week" | "month" | "quarter" | "year" | null;
        id: number;
        investor_id: number;
        accepted: boolean;
        startup_id: number;
        amount_invested: string;
        interest_rate: string | null;
        total_return_paid: string | null;
        maturity_date: string | null;
        investment_amount_paid: boolean | null;
        createdAt: string | null;
    }[],
    searchParams: { 
        page?: string
     }
}

export default async function InvestorsStartups({ contracts, searchParams }: Props)
{
    const contractsWithStartUps = await Promise.all(contracts.map(async contract => {
        const startup = await getStartup(contract.startup_id)
        return { ...contract, startup }
    }))

    const page = searchParams?.page ? parseInt(searchParams.page) : 1

    const startIndex = ((page - 1) * 5) + 1
    const endIndex = contractsWithStartUps.length >= page * 5 ? page * 5 : contractsWithStartUps.length
    
    const nextAvailable = endIndex < contractsWithStartUps.length
    const prevAvailable = page > 1

    return (
        <div className='flex flex-1 flex-col gap-4'>
            <SearchStartupsBar />
            <div className="flex flex-1 bg-white w-full flex-col overflow-auto">
                <div className='flex w-full items-center justify-between px-4 py-8 tableShadow'>
                    <p className='text-xs font-medium flex-1'>Name & Startup Details</p>
                    <p className='text-xs font-medium flex-1'>Amount Invested</p>
                    <p className='text-xs font-medium flex-1'>Return of Investment</p>
                    <p className='text-xs font-medium flex-1'>Maturity Date</p>
                    <p className='text-xs font-medium flex-1'>Due Payment Date</p>
                </div>
                {contractsWithStartUps.length > 0 ? contractsWithStartUps.slice(startIndex - 1, endIndex).map((contract, index) => (
                    <div className={cn('flex w-full items-center justify-between px-4', (index % 2 !== 0) && 'bg-[#A1A1A133]')}>
                        <div className='flex-1 flex flex-col items-center justify-center gap-1'>
                            <Link href={`/startup/${contract.startup?.id.toString()}`}>
                                <p className='text-sm underline'>{contract.startup?.company_name}</p>
                            </Link>
                            <p className='text-xs font-light'>{contract.startup?.industry_sector}</p>
                        </div>
                        <div className='flex-1 flex items-center justify-center bg-[#B4B4B4CC] h-full py-6 gap-2'>
                            <span>${contract.amount_invested}</span>
                            {!contract.investment_amount_paid && <PayNow contractId={contract.id} />}
                        </div>
                        <div className='flex-1 flex items-center justify-center py-6'>{contract.interest_rate}%</div>
                        <div className='flex-1 flex items-center justify-center bg-[#B4B4B4CC] h-full py-6'>{contract.maturity_date}</div>
                        <div className='flex-1 flex items-center justify-center py-6'>{getNextDueDate(new Date(contract.createdAt!), contract.payment_interval!).toDateString()}</div>
                    </div>
                )) : (
                    <p className='mb-auto flex items-center justify-center mt-12'>
                        No Data Yet!
                    </p>
                )}
                <div className='h-10 flex items-center px-4 justify-between mt-auto'>
                    <p className='text-xs font-medium'>Showing {startIndex} - {endIndex}</p>
                    <div className='flex gap-2'>
                        <Link prefetch={true} href={prevAvailable ? `/?page=${page - 1}` : '#'}>
                            <ChevronLeft stroke={prevAvailable ? '#000' : '#00000050'} size={16} />
                        </Link>
                        <Link prefetch={true} href={nextAvailable ? `/?page=${page + 1}` : '#'}>
                            <ChevronRight stroke={nextAvailable ? '#000' : '#00000050'} size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}