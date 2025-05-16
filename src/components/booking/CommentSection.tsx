
import { useState } from "react";
import AddComment from "@/components/AddComment";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Comment } from "@/types";
import { getRelativeTime } from "@/lib/utils";

interface CommentSectionProps {
  comments: Comment[];
  onSubmitComment: (commentData: {
    content: string;
    name: string;
    email: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const CommentSection = ({ 
  comments, 
  onSubmitComment, 
  isSubmitting 
}: CommentSectionProps) => {
  const visibleComments = comments;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Comments</h2>
        <span className="text-muted-foreground text-sm">
          {visibleComments.length} comment
          {visibleComments.length !== 1 ? "s" : ""}
        </span>
      </div>

      {visibleComments.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground">No comments yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleComments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">
                    {comment.createdBy.name || "Anonymous"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getRelativeTime(comment.createdAt)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{comment.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddComment
        onSubmit={onSubmitComment}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
