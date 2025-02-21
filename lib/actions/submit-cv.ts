import { Resend } from "resend";

export async function submitCV(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const jobPosition = formData.get("jobPosition") as string;
    const cvFile = formData.get("cv") as File;

    if (!name || !email || !jobPosition || !cvFile) {
        return { error: "Missing required fields" };
    }

    const resend = new Resend("re_ATUTuMzg_BMxYS9iqHuUjnG7jVMP868is"); // Use your API Key

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

        return { success: "CV submitted successfully!", response };
    } catch (error: unknown) {
        console.error("Resend Error:", error);

        let errorMessage = "Failed to send email.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return { error: errorMessage };
    }
}
