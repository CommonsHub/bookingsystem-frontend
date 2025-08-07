import React, { useState } from "react";
import AddComment from "@/components/AddComment";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RequestComment } from "@/types";
import { getRelativeTime } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { useAppTranslation } from "@/hooks/use-translation";

interface RequestCommentSectionProps {
  comments: RequestComment[];
  onSubmitComment: (commentData: {
    content: string;
    name: string;
    email: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const RequestCommentSection = ({
  comments,
  onSubmitComment,
  isSubmitting
}: RequestCommentSectionProps) => {
  const { user } = useAuth();
  const { t } = useAppTranslation();
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
            <React.Fragment key={comment.id}>
              {comment.createdBy.name === "System" ? (
                // light comment like display with the parsed content
                // of the request changes
                <Card className="bg-muted/20">
                  <CardHeader className="pb-2">
                    <div className="text-sm text-muted-foreground">
                      {getRelativeTime(comment.createdAt)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{comment.content}</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        {comment.createdBy.name || t("anonymous")}
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
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {user ?
        <AddComment
          onSubmit={onSubmitComment}
          isSubmitting={isSubmitting}
        />
        :
        // If user is not authenticated, show a message to log in to comment
        <div className="text-center py-8 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground">
            <a href="/login" className="text-blue-600 hover:underline">Log in</a> to add a comment.
          </p>
        </div>
      }
    </div>
  );
}; 