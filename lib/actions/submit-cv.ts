import { Resend } from "resend";

export async function submitCV(formData: FormData) {
    console.log("Received FormData:", formData);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const jobPosition = formData.get("jobPosition") as string;
    const cvFile = formData.get("cv") as File;

    console.log("CV File Raw Data:", cvFile);


    if (!name || !email || !jobPosition || !cvFile) {
        return { error: "Missing required fields" };
    }

    if (!(cvFile instanceof File)) {
        console.error("Error: cvFile is not recognized as a File", { cvFile });
        return { success: false, error: "Invalid file upload" };
    }

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
