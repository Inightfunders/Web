import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use Service Role Key for storage writes
);

export async function submitCV(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const jobPosition = formData.get("jobPosition") as string;
    let cvFile = formData.get("cv");

    if (!name || !email || !jobPosition || !cvFile) {
        console.error("Missing required fields", { name, email, jobPosition, cvFile });
        return { error: "Missing required fields" };
    }

    // Ensure cvFile is a Blob before conversion
    if (!(cvFile instanceof Blob)) {
        console.warn("⚠️ cvFile is not a Blob, skipping conversion...");
        return { success: false, error: "Invalid file upload" };
    }

    // Convert Blob to File
    const fileName = `${Date.now()}-${(cvFile as any).name ?? "uploaded_cv.pdf"}`;
    const filePath = `cvs/${fileName}`; // Save inside `cvs/` folder in Supabase bucket

    try {
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from("job-applications")
            .upload(filePath, cvFile, {
                contentType: cvFile.type,
                upsert: false, // Avoid overwriting existing files
            });

        if (error) {
            console.error("Supabase Upload Error:", error);
            return { success: false, error: error.message };
        }

        // Get Public URL for the uploaded CV
        const { data: publicURL } = supabase.storage
            .from("job-applications")
            .getPublicUrl(filePath);

        console.log("File uploaded successfully:", publicURL.publicUrl);

        // Store the job application in the database
        const { error: dbError } = await supabase
            .from("job_applications")
            .insert([{ name, email, job_position: jobPosition, cv_url: publicURL.publicUrl }]);

        if (dbError) {
            return { success: false, error: dbError.message };
        }

        // Send Email with CV Download Link
        const resend = new Resend(process.env.RESEND_API_KEY); 

        const response = await resend.emails.send({
            from: "non-reply@insightfunders.com",
            to: "Team@insightfunders.com",
            subject: `New Job Application: ${name} - ${jobPosition}`,
            text: `Name: ${name}\nEmail: ${email}\nPosition Applied: ${jobPosition}\nDownload CV: ${publicURL.publicUrl}`,
        });

        return { success: "CV submitted successfully!", fileUrl: publicURL.publicUrl, response };
    } catch (error: unknown) {
        console.error("Resend Error:", error);
        return { error: error instanceof Error ? error.message : "Failed to send email." };
    }
}