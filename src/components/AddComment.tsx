
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AddCommentProps {
  onSubmit: (comment: { content: string; name: string; email: string }) => void;
  isSubmitting?: boolean;
}

const AddComment = ({ onSubmit, isSubmitting = false }: AddCommentProps) => {
  const [content, setContent] = useState("");
  const { user } = useAuth();

  if (!user) {
    return null;
  }
  const name = user.name || "";
  const email = user.email || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || !name.trim() || !email.trim()) return;

    onSubmit({ content, name, email });
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-32"
          required
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          <Send className="h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Add Comment"}
        </Button>
      </div>
    </form>
  );
};

export default AddComment;
