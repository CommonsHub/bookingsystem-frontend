import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      } else if (event === "SIGNED_OUT") {
        setError("Authentication failed. Please try again.");
      }
    });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div>Completing sign in...</div>
      )}
    </div>
  );
}
