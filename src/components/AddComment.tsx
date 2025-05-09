
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

interface AddCommentProps {
  onSubmit: (comment: { content: string; name: string; email: string }) => void;
  isSubmitting?: boolean;
}

const AddComment = ({ onSubmit, isSubmitting = false }: AddCommentProps) => {
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Load saved values from localStorage
    const savedName = localStorage.getItem("commenter-name") || "";
    const savedEmail = localStorage.getItem("commenter-email") || "";
    setName(savedName);
    setEmail(savedEmail);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !name.trim() || !email.trim()) return;

    // Save to localStorage for future use
    localStorage.setItem("commenter-name", name);
    localStorage.setItem("commenter-email", email);

    onSubmit({ content, name, email });
    setContent(""); // Clear content after submission
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

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Your email will not be displayed publicly
          </p>
        </div>
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
