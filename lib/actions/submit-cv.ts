import { Resend } from "resend";

export async function submitCV(formData: FormData) {
    console.log("Received FormData:", formData);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const jobPosition = formData.get("jobPosition") as string;
    const cvFile = formData.get("cv");

    console.log("CV File Type:", typeof cvFile);
    console.log("CV File Content:", cvFile);

    if (!(cvFile instanceof File)) {
        console.error("❌ Error: cvFile is not recognized as a File", { cvFile });
        return { success: false, error: "Invalid file upload" };
    }

    if (!name || !email || !jobPosition || !cvFile) {
        console.error("❌ Missing fields:", { name, email, jobPosition, cvFile });
        return { error: "Missing required fields" };
    }

    console.log("✅ CV File Validated:", {
        name: cvFile.name,
        size: cvFile.size,
        type: cvFile.type,
        lastModified: cvFile.lastModified,
    });

    const fileArrayBuffer = await cvFile.arrayBuffer();
    const fileBuffer = Buffer.from(new Uint8Array(fileArrayBuffer)); // Ensure proper conversion

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
                    content: fileBuffer.toString("base64"), // Correct conversion to Base64
                },
            ],
        });

        return { success: "CV submitted successfully!", response };
    } catch (error) {
        console.error("❌ Resend Error:", error);

        let errorMessage = "Failed to send email.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return { error: errorMessage };
    }
}
