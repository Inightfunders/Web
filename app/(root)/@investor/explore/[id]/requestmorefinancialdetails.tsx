import RequestMoreFinancialDetails from "@/components/investors/RequestMoreFinancialDetails"
import { getFinancialDetailsRequests, getCapTable, getPitchDeck, getTaxReturns, getFinancialStatements, getLegalDocuments } from "@/lib/actions/investor"

type Props = { 
    investorId: number 
    startupId: number
}

export default async function RequestMoreFinancialDetailsContainer({ investorId, startupId }: Props)
{
    const investorFinancialDetailsRequests = await getFinancialDetailsRequests(investorId, startupId)

    const hasRequested = investorFinancialDetailsRequests.some(request => request.startup_id === startupId)

    // const capTable= await getCapTable(startupId);

    // console.log("capTable", capTable);

    return <RequestMoreFinancialDetails hasRequested={hasRequested} startupId={startupId} investorId={investorId} />
}