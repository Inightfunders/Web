import { NextResponse } from "next/server";
import { generateHRReport } from "@/lib/actions/generate-excel";

export async function GET() {
    try {
        const result = await generateHRReport();
        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
