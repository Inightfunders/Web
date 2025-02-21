export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { submitCV } from "@/lib/actions/submit-cv";

export async function POST(req: Request) {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
    }

    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
        return NextResponse.json({ error: "Invalid content type. Expected multipart/form-data" }, { status: 400 });
    }

    try {
        const formData = await req.formData();
        const result = await submitCV(formData);

        return new NextResponse(
            JSON.stringify({ success: true, data: result }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
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
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                }
            }
        );
    }
}

export function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
