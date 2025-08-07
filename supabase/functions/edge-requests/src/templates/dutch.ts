import { EmailTemplate } from "./english.ts";

export const dutchTemplate: EmailTemplate = {
  newBooking: {
    subject: (title: string) => `Nieuwe reserveringsaanvraag: ${title}`,
    body: (record: any, formattedStartDate: string, formattedStartTime: string, formattedEndTime: string) => `Een nieuwe reserveringsaanvraag is ontvangen.

Reserveringsinformatie:
----------------------------
Titel: ${record.title}
Beschrijving: ${record.description || "Geen"}
Ruimte: ${record.room_name} (capaciteit: ${record.room_capacity})
Datum: ${formattedStartDate}
Tijd: ${formattedStartTime} - ${formattedEndTime}
Aangemaakt door: ${record.created_by_name || "Niet gespecificeerd"} (${record.created_by_email})

Om deze reservering goed te keuren, log in op het reserveringssysteem.`
  },
  confirmedBooking: {
    subject: (title: string) => `Reservering bevestigd: ${title}`,
    body: (record: any, formattedStartDate: string, formattedStartTime: string, formattedEndTime: string) => `Een reservering is bevestigd.

Reserveringsinformatie:
----------------------------
Titel: ${record.title}
Beschrijving: ${record.description || "Geen"}
Ruimte: ${record.room_name} (capaciteit: ${record.room_capacity})
Datum: ${formattedStartDate}
Tijd: ${formattedStartTime} - ${formattedEndTime}
Aangemaakt door: ${record.created_by_name || "Niet gespecificeerd"} (${record.created_by_email})
Goedgekeurd door: ${record.approved_by_email}
Goedkeuringsdatum: ${new Date(record.approved_at || "").toLocaleString()}`
  },
  newRequest: {
    subject: (title: string) => `Nieuwe ondersteuningsaanvraag: ${title}`,
    body: (record: any) => `Een nieuwe ondersteuningsaanvraag is ontvangen.

Aanvraaginformatie:
----------------------------
Titel: ${record.title}
Beschrijving: ${record.description}
Type: ${record.request_type}
Prioriteit: ${record.priority}
Status: ${record.status}
Aangemaakt door: ${record.created_by_name || "Niet gespecificeerd"} (${record.created_by_email})
Contact e-mail: ${record.email}
Contact naam: ${record.name}
Telefoon: ${record.phone || "Niet opgegeven"}
Organisatie: ${record.organization || "Niet gespecificeerd"}
Verwachte voltooiingsdatum: ${record.expected_completion_date ? new Date(record.expected_completion_date).toLocaleDateString() : "Niet gespecificeerd"}
Aanvullende details: ${record.additional_details || "Geen"}
Bijlagen: ${record.attachments && record.attachments.length > 0 ? record.attachments.join(", ") : "Geen"}

Om deze aanvraag te bekijken, log in op het reserveringssysteem.`
  },
  newRequestComment: {
    subject: (requestTitle: string) => `Nieuw commentaar op aanvraag: ${requestTitle}`,
    body: (record: any) => `Er is een nieuw commentaar toegevoegd aan een ondersteuningsaanvraag.

Commentaar informatie:
----------------------------
Aanvraag ID: ${record.request_id}
Commentaar door: ${record.created_by_name || "Niet gespecificeerd"} (${record.created_by_email})
Commentaar: ${record.content}
Geplaatst op: ${new Date(record.created_at).toLocaleString()}

Om de volledige aanvraag en het commentaar te bekijken, log in op het reserveringssysteem.`
  }
};
