
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { CalendarDays, PlusCircle, UserIcon, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LogoutConfirmDialog } from "./LogoutConfirmDialog";
import { useLogoutDraftHandler } from "@/hooks/useLogoutDraftHandler";
import { useState } from "react";
import { canUserApproveBookings } from "@/utils/bookingHelpers";

const Header = () => {
  const { user, signOut, getDisplayName } = useAuth();
  const { t } = useTranslation();
  const { hasUserDrafts, clearAllData, clearUserDrafts } = useLogoutDraftHandler();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleSignOutClick = () => {
    if (hasUserDrafts()) {
      setShowLogoutDialog(true);
    } else {
      handleLogoutConfirm(true);
    }
  };

  const handleLogoutConfirm = async (keepDrafts: boolean) => {
    if (!keepDrafts) {
      clearUserDrafts();
    }
    clearAllData();
    setShowLogoutDialog(false);
    await signOut();
    // Trigger a page reload to refresh booking data for anonymous users
    window.location.reload();
  };

  return (
    <>
      <header className="w-full border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <CalendarDays className="h-6 w-6 text-brand-600" />
            <span className="font-semibold text-xl">
              {t('app.title')}
            </span>
          </Link>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            
            <Button asChild variant="default">
              <Link to="/bookings/new" className="flex items-center space-x-2">
                <PlusCircle className="h-4 w-4" />
                <span className="hidden md:block">{t('bookings.new')}</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link to="/requests/new" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="hidden md:block">{t('requests.new')}</span>
              </Link>
            </Button>
            
            {canUserApproveBookings(user) && (
              <Button asChild variant="outline">
                <Link to="/ics-preview" className="flex items-center space-x-2">
                  <span className="hidden md:block">ICS Preview</span>
                </Link>
              </Button>
            )}
          {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden md:block">
                      {t('greeting', { name: getDisplayName() })}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">{t('nav.profile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOutClick}>
                    {t('auth.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline">
                <Link to="/login" className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden md:block">{t('auth.login')}</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Header;
