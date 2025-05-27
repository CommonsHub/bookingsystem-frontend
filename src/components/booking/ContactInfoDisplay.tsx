
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Booking } from "@/types";
import { Mail, User } from "lucide-react";

interface ContactInfoDisplayProps {
  booking: Booking;
}

export const ContactInfoDisplay = ({ booking }: ContactInfoDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium">Name</h4>
              <p className="text-muted-foreground">{booking.createdBy.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium">Email</h4>
              <p className="text-muted-foreground">{booking.createdBy.email}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
