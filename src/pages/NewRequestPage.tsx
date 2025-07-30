import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { RequestFormData } from "@/components/request/RequestFormSchema";
import { RequestForm } from "@/components/request/RequestForm";
import { useAuth } from "@/context/AuthContext";
import { useRequestFormOperations } from "@/hooks/useRequestFormOperations";
import { createDefaultRequestValues } from "@/utils/requestDefaults";

const NewRequestPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [defaultValues, setDefaultValues] = useState<RequestFormData | null>(null);
  const { handleCreateRequest, isSubmitting } = useRequestFormOperations();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const defaultEmail = user?.email || "";

  useEffect(() => {
    if (user) {
      setDefaultValues(createDefaultRequestValues(defaultEmail, {
        name: user?.name || "",
      }));
    }
  }, [defaultEmail, user?.name, user]);

  const onSubmit = async (data: RequestFormData) => {
    await handleCreateRequest(data);
  };

  const handleCancel = () => {
    navigate("/");
  };

  // Show loading while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (!defaultValues) {
    return <div>Loading...</div>;
  }

  return (
    <RequestForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default NewRequestPage; 