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

interface CancelRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelRequestDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: CancelRequestDialogProps) => {
  const { t } = useTranslation();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('requests.cancelDialog.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('requests.cancelDialog.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('requests.cancelDialog.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t('requests.cancelDialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 