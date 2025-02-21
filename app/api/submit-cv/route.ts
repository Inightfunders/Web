import { NextResponse } from "next/server";
import { submitCV } from "@/lib/actions/submit-cv";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const result = await submitCV(formData);
        return NextResponse.json({ success: true, data: result });
    } catch (error: unknown) {
        let errorMessage = "An unknown error occurred.";
        
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
