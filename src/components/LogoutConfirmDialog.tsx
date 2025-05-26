
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import { buttonVariants } from "@/components/ui/button";

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (keepDrafts: boolean) => void;
}

export const LogoutConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmDialogProps) => {
  const { t } = useTranslation();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription>
            You have draft booking data saved locally. Would you like to keep this data for future use? 
            This data could be accessed by other users on this device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(false)}
            className={buttonVariants({ variant: "destructive" })}
          >
            Clear Drafts & Logout
          </AlertDialogAction>
          <AlertDialogAction
            onClick={() => onConfirm(true)}
          >
            Keep Drafts & Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
