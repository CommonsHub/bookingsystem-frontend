// Setup type definitions for built-in Supabase Runtime APIs
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";
import { getTemplateFromLanguageCode } from "./language-utils.ts";

export const sendEmail = async (
  record: any,
  type: string,
) => {
  // Récupérer les variables d'environnement
  const emailHost = Deno.env.get("EMAIL_HOST");
  const emailPort = parseInt(Deno.env.get("EMAIL_PORT") || "587");
  const emailUser = Deno.env.get("EMAIL_USER");
  const emailPass = Deno.env.get("EMAIL_PASS");
  const officeManagerEmail = Deno.env.get("OFFICE_MANAGER_EMAIL");
  // Vérifier si les variables d'environnement sont définies
  if (
    !emailHost ||
    !emailUser ||
    !emailPass ||
    !officeManagerEmail
  ) {
    console.error("Missing email configuration in environment variables");
    return {
      error: new Response(
        JSON.stringify({
          success: false,
          error: "Email configuration incomplete",
          missing: {
            host: !emailHost,
            user: !emailUser,
            pass: !emailPass,
            recipient: !officeManagerEmail,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 500,
        }
      ),
    };
  }
  // Configure email client avec les variables d'environnement
  const client = new SMTPClient({
    connection: {
      hostname: emailHost,
      port: emailPort,
      tls: true,
      auth: {
        username: emailUser,
        password: emailPass,
      },
    },
  });
  console.log("Connecting to SMTP server:", emailHost, emailPort);

  // Format the date and time for better readability
  const startDateTime = new Date(record.start_time);
  const endDateTime = new Date(record.end_time);
  const formattedStartDate = startDateTime.toLocaleDateString();
  const formattedStartTime = startDateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedEndTime = endDateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Get the appropriate email template based on the booking's language
  console.log("Booking language:", record.language);
  const emailTemplate = getTemplateFromLanguageCode(record.language);

  let subject = "";
  let body = "";

  // Determine email content based on the event type
  if (type === "new_booking") {
    subject = emailTemplate.newBooking.subject(record.title);
    body = emailTemplate.newBooking.body(
      record,
      formattedStartDate,
      formattedStartTime,
      formattedEndTime
    );
  } else if (type === "confirmed_booking") {
    subject = emailTemplate.confirmedBooking.subject(record.title);
    body = emailTemplate.confirmedBooking.body(
      record,
      formattedStartDate,
      formattedStartTime,
      formattedEndTime
    );
  } else if (type === "new_request") {
    subject = emailTemplate.newRequest.subject(record.title);
    body = emailTemplate.newRequest.body(record);
  } else if (type === "new_request_comment") {
    // For request comments, we need to get the request title
    // Since we only have the comment record, we'll use a generic title
    const requestTitle = `Request #${record.request_id}`;
    subject = emailTemplate.newRequestComment.subject(requestTitle);
    body = emailTemplate.newRequestComment.body(record);
  }
  console.log(`Sending email to ${officeManagerEmail} - Subject: ${subject}`);
  // Send the email
  await client.send({
    from: emailUser,
    to: officeManagerEmail,
    cc: record.created_by_email,
    subject: subject,
    content: body,
  });
  await client.close();
  return { success: true };
};
