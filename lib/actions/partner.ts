'use server'

import 'server-only'
import { db } from "@/db"
import { partners } from "@/migrations/schema"
import { eq } from "drizzle-orm"

export const getPartnerCompanyInfo = async (partner_id: string) => {
    try {
        const partnerCompanyInfo = await db.query.partners.findFirst({
            where: eq(partners.id, partner_id),
        })

        if (!partnerCompanyInfo) {
            throw new Error("Partner not found");
        }
      
          return partnerCompanyInfo;
    } catch (error) {
        console.error("Error fetching partnerCompanyInfo: ", error);
        throw error;
    }
}

export const editPartnerCompanyInfo = async (partner_id: string, partner_name: string, occupation: string, company_name: string) => {
    try {
        const updatedPartner = await db.update(partners).set({
                partner_name, occupation, company_name,
            }).where(eq(partners.id, partner_id)).returning();

        if (updatedPartner.length === 0) {
            throw new Error("Partner not found");
        }

        return updatedPartner[0];
    } catch (error) {
        console.error("Error updating partnerCompanyInfo: ", error);
        throw error;
    }
}