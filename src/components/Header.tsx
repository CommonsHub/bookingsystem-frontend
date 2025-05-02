
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, PlusCircle } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <CalendarDays className="h-6 w-6 text-brand-600" />
          <span className="font-semibold text-xl">Commons Hub Brussels Bookings</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Button asChild variant="default">
            <Link to="/bookings/new" className="flex items-center space-x-2">
              <PlusCircle className="h-4 w-4" />
              <span>New Booking</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
