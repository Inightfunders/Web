export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { submitCV } from "@/lib/actions/submit-cv";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const result = await submitCV(formData);

        const response = NextResponse.json({ success: true, data: result });

        response.headers.set("Access-Control-Allow-Origin", "https://insightfunders.com");
        response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}

// Handle CORS preflight request
export function OPTIONS() {
    const response = NextResponse.json({}, { status: 200 });

    response.headers.set("Access-Control-Allow-Origin", "https://insightfunders.com");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
}
