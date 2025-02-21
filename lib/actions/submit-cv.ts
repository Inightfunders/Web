import { Resend } from "resend";

export async function submitCV(formData: FormData) {
    console.log("🟢 Received FormData:", formData);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const jobPosition = formData.get("jobPosition") as string;
    let cvFile = formData.get("cv");

    console.log("📄 CV File Raw Data:", cvFile);

    if (!name || !email || !jobPosition || !cvFile) {
        console.error("❌ Missing required fields", { name, email, jobPosition, cvFile });
        return { error: "Missing required fields" };
    }

    // 🔥 **Force Convert to File (if not already a File)**
    if (!(cvFile instanceof File)) {
        console.warn("⚠️ cvFile is not a File, manually converting...");

        // Convert to a `File` manually using `Blob`
        cvFile = new File(
            [await (cvFile as Blob).arrayBuffer()], // Convert Blob to Buffer
            (cvFile as Blob & { name: string }).name, // Use filename
            { type: (cvFile as Blob).type } // Keep original MIME type
        );
    }

    console.log("✅ CV File Validated:", {
        name: cvFile.name,
        size: cvFile.size,
        type: cvFile.type,
        lastModified: cvFile.lastModified,
    });

    const resend = new Resend(process.env.RESEND_API_KEY); 

    try {
        const response = await resend.emails.send({
            from: "non-reply@insightfunders.com",
            to: "Team@insightfunders.com",
            subject: `New Job Application: ${name} - ${jobPosition}`,
            text: `Name: ${name}\nEmail: ${email}\nPosition Applied: ${jobPosition}`,
            attachments: [
                {
                    filename: cvFile.name,
                    content: Buffer.from(await cvFile.arrayBuffer()).toString("base64"),
                },
            ],
        });

        console.log("✅ Email Sent Successfully!");
        return { success: "CV submitted successfully!", response };
    } catch (error: unknown) {
        console.error("🚨 Resend Error:", error);

        let errorMessage = "Failed to send email.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return { error: errorMessage };
    }
}
