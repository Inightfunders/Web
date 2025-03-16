import { createClient } from "@supabase/supabase-js";
import ExcelJS from "exceljs";

// Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function generateHRReport() {
    // Fetch all applications
    const { data: applications, error } = await supabase
        .from("job_applications")
        .select("*");

    if (error) {
        console.error("Error fetching applications:", error);
        return { error: error.message };
    }

    if (!applications || applications.length === 0) {
        return { error: "No job applications found." };
    }

    // Create an Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Job Applications");

    // Define Columns
    worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Name", key: "name", width: 20 },
        { header: "Email", key: "email", width: 25 },
        { header: "Job Position", key: "job_position", width: 25 },
        { header: "CV URL", key: "cv_url", width: 40 },
        { header: "Submitted At", key: "submitted_at", width: 20 }
    ];

    // Add Rows
    applications.forEach((app) => {
        worksheet.addRow({
            id: app.id,
            name: app.name,
            email: app.email,
            job_position: app.job_position,
            cv_url: app.cv_url,
            submitted_at: new Date(app.submitted_at).toLocaleString(),
        });
    });

    // Save Excel file to Buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Upload file to Supabase Storage
    const filePath = `hr-reports/job-applications-${Date.now()}.xlsx`;
    const { data, error: uploadError } = await supabase.storage
        .from("job-applications")
        .upload(filePath, buffer, { contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    if (uploadError) {
        return { error: uploadError.message };
    }

    // Get Public URL of Excel file
    const { data: publicURL } = supabase.storage.from("job-applications").getPublicUrl(filePath);

    return { success: "HR Report generated!", fileUrl: publicURL.publicUrl };
}
