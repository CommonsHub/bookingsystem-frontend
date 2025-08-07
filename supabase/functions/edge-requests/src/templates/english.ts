export interface EmailTemplate {
  newBooking: {
    subject: (title: string) => string;
    body: (record: any, formattedStartDate: string, formattedStartTime: string, formattedEndTime: string) => string;
  };
  confirmedBooking: {
    subject: (title: string) => string;
    body: (record: any, formattedStartDate: string, formattedStartTime: string, formattedEndTime: string) => string;
  };
  newRequest: {
    subject: (title: string) => string;
    body: (record: any) => string;
  };
  newRequestComment: {
    subject: (requestTitle: string) => string;
    body: (record: any) => string;
  };
}

export const englishTemplate: EmailTemplate = {
  newBooking: {
    subject: (title: string) => `New booking request: ${title}`,
    body: (record: any, formattedStartDate: string, formattedStartTime: string, formattedEndTime: string) => `A new booking request has been received.

Booking Information:
----------------------------
Title: ${record.title}
Description: ${record.description || "None"}
Room: ${record.room_name} (capacity: ${record.room_capacity})
Date: ${formattedStartDate}
Time: ${formattedStartTime} - ${formattedEndTime}
Created by: ${record.created_by_name || "Not specified"} (${record.created_by_email})

To approve this booking, please log in to the booking system.`
  },
  confirmedBooking: {
    subject: (title: string) => `Booking confirmed: ${title}`,
    body: (record: any, formattedStartDate: string, formattedStartTime: string, formattedEndTime: string) => `A booking has been confirmed.

Booking Information:
----------------------------
Title: ${record.title}
Description: ${record.description || "None"}
Room: ${record.room_name} (capacity: ${record.room_capacity})
Date: ${formattedStartDate}
Time: ${formattedStartTime} - ${formattedEndTime}
Created by: ${record.created_by_name || "Not specified"} (${record.created_by_email})
Approved by: ${record.approved_by_email}
Approval date: ${new Date(record.approved_at || "").toLocaleString()}`
  },
  newRequest: {
    subject: (title: string) => `New support request: ${title}`,
    body: (record: any) => `A new support request has been received.

Request Information:
----------------------------
Title: ${record.title}
Description: ${record.description}
Type: ${record.request_type}
Priority: ${record.priority}
Status: ${record.status}
Created by: ${record.created_by_name || "Not specified"} (${record.created_by_email})
Contact Email: ${record.email}
Contact Name: ${record.name}
Phone: ${record.phone || "Not provided"}
Organization: ${record.organization || "Not specified"}
Expected Completion Date: ${record.expected_completion_date ? new Date(record.expected_completion_date).toLocaleDateString() : "Not specified"}
Additional Details: ${record.additional_details || "None"}
Attachments: ${record.attachments && record.attachments.length > 0 ? record.attachments.join(", ") : "None"}

To review this request, please log in to the booking system.`
  },
  newRequestComment: {
    subject: (requestTitle: string) => `New comment on request: ${requestTitle}`,
    body: (record: any) => `A new comment has been added to a support request.

Comment Information:
----------------------------
Request ID: ${record.request_id}
Comment by: ${record.created_by_name || "Not specified"} (${record.created_by_email})
Comment: ${record.content}
Posted at: ${new Date(record.created_at).toLocaleString()}

To view the full request and comment, please log in to the booking system.`
  }
};
