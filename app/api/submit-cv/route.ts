export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { submitCV } from "@/lib/actions/submit-cv";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const result = await submitCV(formData);

        return new NextResponse(
            JSON.stringify({ success: true, data: result }),
            {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                }
            }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ success: false, error: (error as Error).message }),
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                }
            }
        );
    }
}

