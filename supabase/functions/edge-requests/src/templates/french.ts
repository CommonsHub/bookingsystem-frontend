import { EmailTemplate } from "./english.ts";

export const frenchTemplate: EmailTemplate = {
  newBooking: {
    subject: (title: string) => `Nouvelle demande de réservation: ${title}`,
    body: (record: any, formattedStartDate: string, formattedStartTime: string, formattedEndTime: string) => `Une nouvelle demande de réservation a été reçue.

Informations de réservation:
----------------------------
Titre: ${record.title}
Description: ${record.description || "Aucune"}
Salle: ${record.room_name} (capacité: ${record.room_capacity})
Date: ${formattedStartDate}
Horaire: ${formattedStartTime} - ${formattedEndTime}
Créée par: ${record.created_by_name || "Non spécifié"} (${record.created_by_email})

Pour approuver cette réservation, veuillez vous connecter au système de réservation.`
  },
  confirmedBooking: {
    subject: (title: string) => `Réservation confirmée: ${title}`,
    body: (record: any, formattedStartDate: string, formattedStartTime: string, formattedEndTime: string) => `Une réservation a été confirmée.

Informations de réservation:
----------------------------
Titre: ${record.title}
Description: ${record.description || "Aucune"}
Salle: ${record.room_name} (capacité: ${record.room_capacity})
Date: ${formattedStartDate}
Horaire: ${formattedStartTime} - ${formattedEndTime}
Créée par: ${record.created_by_name || "Non spécifié"} (${record.created_by_email})
Approuvée par: ${record.approved_by_email}
Date d'approbation: ${new Date(record.approved_at || "").toLocaleString()}`
  },
  newRequest: {
    subject: (title: string) => `Nouvelle demande de support: ${title}`,
    body: (record: any) => `Une nouvelle demande de support a été reçue.

Informations de la demande:
----------------------------
Titre: ${record.title}
Description: ${record.description}
Type: ${record.request_type}
Priorité: ${record.priority}
Statut: ${record.status}
Créée par: ${record.created_by_name || "Non spécifié"} (${record.created_by_email})
Email de contact: ${record.email}
Nom de contact: ${record.name}
Téléphone: ${record.phone || "Non fourni"}
Organisation: ${record.organization || "Non spécifiée"}
Date de completion attendue: ${record.expected_completion_date ? new Date(record.expected_completion_date).toLocaleDateString() : "Non spécifiée"}
Détails supplémentaires: ${record.additional_details || "Aucun"}
Pièces jointes: ${record.attachments && record.attachments.length > 0 ? record.attachments.join(", ") : "Aucune"}

Pour examiner cette demande, veuillez vous connecter au système de réservation.`
  },
  newRequestComment: {
    subject: (requestTitle: string) => `Nouveau commentaire sur la demande: ${requestTitle}`,
    body: (record: any) => `Un nouveau commentaire a été ajouté à une demande de support.

Informations du commentaire:
----------------------------
ID de la demande: ${record.request_id}
Commentaire par: ${record.created_by_name || "Non spécifié"} (${record.created_by_email})
Commentaire: ${record.content}
Posté le: ${new Date(record.created_at).toLocaleString()}

Pour voir la demande complète et le commentaire, veuillez vous connecter au système de réservation.`
  }
};
