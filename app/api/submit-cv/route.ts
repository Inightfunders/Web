import { NextResponse } from "next/server";
import { submitCV } from "@/lib/actions/submit-cv";

export async function OPTIONS() {
    const headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "*"); // Allow all origins or replace with "https://insightfunders.com"
    headers.append("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.append("Access-Control-Allow-Headers", "Content-Type");

    return new Response(null, { headers });
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const result = await submitCV(formData);

        const response = NextResponse.json({ success: true, data: result });
        response.headers.set("Access-Control-Allow-Origin", "*"); // Set CORS header dynamically
        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
        );
    }
}
