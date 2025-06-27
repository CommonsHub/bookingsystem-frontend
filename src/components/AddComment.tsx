import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface AddCommentProps {
  onSubmit: (comment: { content: string; name: string; email: string }) => void;
  isSubmitting?: boolean;
}

const AddComment = ({ onSubmit, isSubmitting = false }: AddCommentProps) => {
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const { profile } = useProfile();
  const { t } = useTranslation();

  if (!user) {
    return null;
  }
  const email = user.email || "";
  const name = profile?.full_name || user.name || email.split("@")[0] || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || !email.trim()) return;

    onSubmit({ content, name, email });
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="comment">{t('comments.label')}</Label>
        <Textarea
          id="comment"
          placeholder={t('comments.placeholder')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-32"
          required
        />
      </div>
      <div className="flex flex-col justify-end items-end space-y-2">
        <Button type="submit" disabled={isSubmitting} className="">
          <Send className="h-4 w-4" />
          {isSubmitting ? t('comments.submitting') : t('comments.addComment')}
        </Button>
        <div className="text-sm text-muted-foreground mb-4">
          {t('comments.addCommentHint', { name: name })}
        </div>
      </div>
    </form >
  );
};

export default AddComment;
