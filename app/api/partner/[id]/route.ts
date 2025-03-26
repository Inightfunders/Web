

import { NextResponse } from "next/server";
import { getPartnerCompanyInfo, editPartnerCompanyInfo } from '@/lib/actions/partner';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const partner_id = url.pathname.split('/').pop();
    
    if (!partner_id) {
      return NextResponse.json({ success: false, error: "Partner ID is required" }, { status: 400 });
    }

    try {
        const partnerInfo = await getPartnerCompanyInfo(partner_id);

        return NextResponse.json({ success: true, data: partnerInfo });
    } catch (error) {
        console.error("Error in GET route: ", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return NextResponse.json({ success: false, error: errorMessage },{ status: 500 });
    }
}

export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const partner_id = url.pathname.split('/').pop();

  if (!partner_id) {
      return NextResponse.json({ success: false, error: "Partner ID is required" }, { status: 400 });
  }

  try {
      const body = await req.json();
      const { partner_name, occupation, company_name } = body;

      const updatedPartner = await editPartnerCompanyInfo(partner_id, partner_name, occupation, company_name);

      return NextResponse.json({ success: true, data: updatedPartner });
  } catch (error) {
      console.error("Error in PATCH route: ", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}