import RequestMoreFinancialDetails from "@/components/investors/RequestMoreFinancialDetails"
import { getFinancialDetailsRequests } from "@/lib/actions/investor"

type Props = { 
    investorId: number 
    startupId: number
}

export default async function RequestMoreFinancialDetailsContainer({ investorId, startupId }: Props)
{
    const investorFinancialDetailsRequests = await getFinancialDetailsRequests(investorId, startupId)
    const hasRequested = investorFinancialDetailsRequests.some(request => request.startup_id === startupId)

    return <RequestMoreFinancialDetails hasRequested={hasRequested} startupId={startupId} investorId={investorId} />
}