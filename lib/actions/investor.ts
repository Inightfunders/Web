'use server'

import 'server-only'
import { db } from "@/db"
import { contracts, financial_details_requests, notifications, startups, transactions, cap_tables, pitch_decks,
    tax_returns, financial_statements, legal_documents, other_documents, users
 } from "@/migrations/schema"
import { eq, sql, and, isNull, ilike, or, isNotNull } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { cache } from "react"
import { getUser } from "./auth"
import { createTransfer } from "./dwolla"

export const getContracts = cache(async (investorId: number, startupId?: number) => {
    if(!startupId) {
        const allContracts = await db.query.contracts.findMany({
            where: (table, { eq }) => eq(table.investor_id, investorId),
            with: {
                startup: true
            }
        });

        const formattedContracts = allContracts.map(contract => ({
            ...contract, company_name: contract.startup?.company_name ?? null, industry_sector: contract.startup?.industry_sector ?? null
        }));
    
        const acceptedContracts = formattedContracts.filter(contract => contract.accepted)
    
        return { allContracts: formattedContracts, acceptedContracts }
    }
    else {
        const contract = await db.query.contracts.findFirst({
            where: (table, { eq, and }) => and(eq(table.startup_id, startupId), eq(table.investor_id, investorId))
        })

        return { contract }
    }
})

export const getStartup = cache(async (startupId: number) => {
    return await db.query.startups.findFirst({
        columns: {
            id: true,
            company_name: true,
            industry_sector: true,
        },
        where: (table, { eq }) => eq(table.id, startupId),
    })
})

export const getExploreStartups = cache(async (investorId: number, params?: { search?: string, stage?: string, industry?: string, id?: number }) => {
    const decodedStage = params?.stage ? decodeURIComponent(params?.stage) as 'Pre-seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C' | 'Series D' | 'Series E' | 'Series F' | 'Public' : undefined
    const decodedIndustry = params?.industry ? decodeURIComponent(params?.industry) as 'Technology' | 'Healthcare' | 'Financial Services' | 'Consumer Goods' | 'Industrial Goods' | 'Energy' | 'Real Estate' | 'Retail' | 'Media and Entertainment' | 'Transportation' | 'Telecommunications' | 'Agriculture' | 'Education' | 'Hospitality and Leisure' | 'Utilities' | 'Other' : undefined
    
    return await db.select({ startup: startups, profile_img: users.profile_img })
                    .from(startups)
                    .leftJoin(contracts, and(eq(contracts.startup_id, startups.id), eq(contracts.investor_id, investorId), eq(contracts.accepted, true)))
                    .leftJoin(users, eq(users.id, startups.user_id))
                    .where(and(isNull(contracts.id), eq(startups.accepted, true), params?.id ? eq(startups.id, params.id) : sql`true`, params?.search ? ilike(startups.company_name, `%${params?.search}%`) : sql`true`, decodedStage ? eq(startups.stage, decodedStage) : sql`true`, decodedIndustry ? eq(startups.industry_sector, decodedIndustry) : sql`true`))
})

export const getFinancialDetailsRequests = cache(async (investorId: number, startupId: number) => {
    return await db.query.financial_details_requests.findMany({
        where: (table, { eq, and }) => and(eq(table.investor_id, investorId), eq(table.startup_id, startupId))
    })
})

export const getAllFinancialDetailsRequests = cache(async (investorId: number) => {
    return await db.query.financial_details_requests.findMany({
        where: (table, { eq }) => eq(table.investor_id, investorId)
    })
})

export const cancelFinancialDetailsRequests = cache(async (investorId: number, requestId: number) => {
    await db.delete(financial_details_requests)
    .where(and(eq(financial_details_requests.id, requestId), eq(financial_details_requests.investor_id, investorId)))
})

export const getAllRequests = cache(async (investorId: number, select: 'startups' | 'contracts' | 'financial_details_requests' | 'all' = 'all') => {
    
    return await db
                .select({
                    ...(select === 'all' || select === 'startups' ? { startups } : {}),
                    ...(select === 'all' || select === 'contracts' ? { contracts } : {}),
                    ...(select === 'all' || select === 'financial_details_requests' ? { financial_details_requests } : {}),
                    ...(select === 'all' || select === 'startups' ? { 'profile_img': users.profile_img } : {})
                })
                .from(startups)
                .leftJoin(contracts, and(eq(contracts.investor_id, investorId), eq(contracts.startup_id, startups.id), or(eq(contracts.accepted, false), isNull(contracts.accepted))))
                .leftJoin(financial_details_requests, and(eq(financial_details_requests.investor_id, investorId), eq(financial_details_requests.startup_id, startups.id), or(eq(financial_details_requests.accepted, false), isNull(financial_details_requests.accepted))))
                .leftJoin(users, eq(users.id, startups.user_id))
                .where(or(
                    isNotNull(contracts.startup_id),
                    isNotNull(financial_details_requests.startup_id)
                ))
})

export const addFinancialDetailsRequest = async (investorId: number, startupId: number) => {
    const [insertedRequest, startUpUser] = await Promise.all([
        db.insert(financial_details_requests).values({
            id: sql`DEFAULT`,
            startup_id: startupId,
            investor_id: investorId,
            accepted: false,
        }).returning({
            id: financial_details_requests.id
        }),
        db.query.startups.findFirst({
            where: (table, { eq }) => eq(table.id, startupId),
            columns: {
                user_id: true
            }
        })
    ]);

    if (!insertedRequest || insertedRequest.length === 0) {
        return { error: 'Failed to add financial details request' };
    }

    const requestId = insertedRequest[0].id; // Extract new request ID

    await db.insert(notifications).values({
        id: sql`DEFAULT`,
        user_id: startUpUser?.user_id!,
        content: 'You have received a new request for financial details.',
        created_at: sql`DEFAULT`,
        is_read: false,
        type: 'Request'
    });

    revalidatePath(`/explore/${startupId}`);
    revalidatePath('/requests');

    return { success: true, request: { id: requestId, investor_id: investorId, startup_id: startupId, accepted: false } };
};

export const createContract = async (data: { amountInvested: number, interestRate: number, investorId: number, maturityDate: Date, paymentInterval: string, startupId: number, termSheet: string }) => {
    const { amountInvested, interestRate, investorId, maturityDate, paymentInterval, startupId, termSheet } = data

    if(!amountInvested || !interestRate || !investorId || !maturityDate || !paymentInterval || !startupId || !termSheet) return { error: 'All fields are required' }
    
    const user = await getUser()

    if(user?.userInvestor?.id !== data.investorId) return { error: 'You are not authorized to create a contract for this startup' }
 
    const [contractId, startUpUser] = await Promise.all([
        db.insert(contracts).values({
            id: sql`DEFAULT`,
            startup_id: startupId,
            investor_id: investorId,
            amount_invested: amountInvested.toString(),
            interest_rate: interestRate.toString(),
            maturity_date: maturityDate.toISOString().split('T')[0],
            payment_interval: paymentInterval.toString() as 'week' | 'month' | 'quarter' | 'year',
            total_return_paid: "0",
            accepted: false,
            createdAt: sql`DEFAULT`,
            term_sheet: termSheet,
            investment_amount_paid: false
        }).returning({
            id: contracts.id
        }),
        db.query.startups.findFirst({
            where: (table, { eq }) => eq(table.id, startupId),
            columns: {
                user_id: true
            }
        })
    ])

    if(contractId.length !== 1) return { error: 'Failed to create contract' }

    await db.insert(notifications).values({
        id: sql`DEFAULT`,
        user_id: startUpUser?.user_id!,
        content: 'Congratulations! You have received a new contract.',
        created_at: sql`DEFAULT`,
        is_read: false,
        type: 'Contract'
    })

    return { success: true }
}

export const payContractAmount = async (contractId: number) => {
    const user = await getUser();

    await db.transaction(async (trx) => {
        const contract = await trx.query.contracts.findFirst({
            where: (table, { eq }) => eq(table.id, contractId),
            columns: {
                id: true,
                investor_id: true,
                amount_invested: true
            },
            with: {
                startup: {
                    columns: {
                        id: true,
                        user_id: true
                    }
                }
            }
        })
    
        if(!contract) return { error: 'Contract not found' }
    
        if(contract.investor_id !== user?.userInvestor?.id) return { error: 'You are not authorized to pay this contract' }
        
        const [startupBankAccount, investorBankAccount] = await Promise.all([
            trx.query.bank_accounts.findFirst({
                where: (table, { eq }) => eq(table.user_id, contract.startup.user_id),
                columns: {
                    funding_source_url: true
                }
            }),
            trx.query.bank_accounts.findFirst({
                where: (table, { eq }) => eq(table.user_id, user?.user.id),
                columns: {
                    funding_source_url: true
                }
            })
        ])

        const transfer = await createTransfer({
            amount: contract.amount_invested,
            sourceFundingSourceUrl: startupBankAccount?.funding_source_url!,
            destinationFundingSourceUrl: investorBankAccount?.funding_source_url!
        })
    
        if(!transfer) return { error: 'Failed to transfer funds' }
    
        await trx.insert(transactions).values({
            id: sql`DEFAULT`,
            sender_id: user?.user?.id!,
            receiver_id: contract.startup.user_id,
            amount: contract.amount_invested
        })
    
        await trx.update(contracts).set({ investment_amount_paid: true }).where(eq(contracts.id, contractId))
    })

    revalidatePath('/')
}

export const getCapTable = cache(async (investorId: number, startupId: number) => {

    const detailsReq = await db.query.financial_details_requests.findFirst({
        where: (table, { eq, and }) => and(
                eq(table.investor_id, investorId), eq(table.startup_id, startupId), eq(table.accepted, true)),
    })
    if(detailsReq) {
        return await db.query.cap_tables.findMany({
            where: (table, { eq }) => eq(table.startup_id, startupId),
        })
    }
})

export const getPitchDeck = cache(async (investorId: number, startupId: number) => {

    const detailsReq = await db.query.financial_details_requests.findFirst({
        where: (table, { eq, and }) => and(
                eq(table.investor_id, investorId), eq(table.startup_id, startupId), eq(table.accepted, true)),
    })
    if(detailsReq) {
        return await db.query.pitch_decks.findMany({
            where: (table, { eq }) => eq(table.startup_id, startupId),
        })
    }
})

export const getTaxReturns = cache(async (investorId: number, startupId: number) => {

    const detailsReq = await db.query.financial_details_requests.findFirst({
        where: (table, { eq, and }) => and(
                eq(table.investor_id, investorId), eq(table.startup_id, startupId), eq(table.accepted, true)),
    })
    if(detailsReq) {
        return await db.query.tax_returns.findMany({
            where: (table, { eq }) => eq(table.startup_id, startupId),
        })
    }
})

export const getFinancialStatements = cache(async (investorId: number, startupId: number) => {

    const detailsReq = await db.query.financial_details_requests.findFirst({
        where: (table, { eq, and }) => and(
                eq(table.investor_id, investorId), eq(table.startup_id, startupId), eq(table.accepted, true)),
    })
    if(detailsReq) {
        return await db.query.financial_statements.findMany({
            where: (table, { eq }) => eq(table.startup_id, startupId),
        })
    }
})

export const getLegalDocuments = cache(async (investorId: number, startupId: number) => {

    const detailsReq = await db.query.financial_details_requests.findFirst({
        where: (table, { eq, and }) => and(
                eq(table.investor_id, investorId), eq(table.startup_id, startupId), eq(table.accepted, true)),
    })
    if(detailsReq) {
        return await db.query.legal_documents.findMany({
            where: (table, { eq }) => eq(table.startup_id,  startupId),
        })
    }
})

export const getOthersDocuments = cache(async (investorId: number, startupId: number) => {

    const detailsReq = await db.query.financial_details_requests.findFirst({
        where: (table, { eq, and }) => and(
                eq(table.investor_id, investorId), eq(table.startup_id, startupId), eq(table.accepted, true)),
    })
    if(detailsReq) {
        return await db.query.other_documents.findMany({
            where: (table, { eq }) => eq(table.startup_id,  startupId),
        })
    }
})

export const getFinancialProjection = cache(async (investorId: number, startupId: number) => {

    const detailsReq = await db.query.financial_details_requests.findFirst({
        where: (table, { eq, and }) => and(
                eq(table.investor_id, investorId), eq(table.startup_id, startupId), eq(table.accepted, true)),
    })
    if(detailsReq) {
        return await db.query.financial_projection.findMany({
            where: (table, { eq }) => eq(table.startup_id,  startupId),
        })
    }
})

export const getBankStatements = cache(async (investorId: number, startupId: number) => {

    const detailsReq = await db.query.financial_details_requests.findFirst({
        where: (table, { eq, and }) => and(
                eq(table.investor_id, investorId), eq(table.startup_id, startupId), eq(table.accepted, true)),
    })
    if(detailsReq) {
        return await db.query.bank_statements.findMany({
            where: (table, { eq }) => eq(table.startup_id,  startupId),
        })
    }
})

export const getNda = cache(async (investorId: number, startupId: number) => {

    const detailsReq = await db.query.financial_details_requests.findFirst({
        where: (table, { eq, and }) => and(
                eq(table.investor_id, investorId), eq(table.startup_id, startupId), eq(table.accepted, true)),
    })
    if(detailsReq) {
        return await db.query.nda.findMany({
            where: (table, { eq }) => eq(table.startup_id,  startupId),
        })
    }
})

export const acceptNda = cache(async (investorId: number, requestId: number) => {
    const updatedNda = await db.update(financial_details_requests).set({ nda_status: true })
        .where(eq(financial_details_requests.id, requestId)).returning();

    if (updatedNda.length === 0) {
        throw new Error("NDA request not found");
    }

    return { success: true, message: "NDA accepted successfully", data: updatedNda };
})