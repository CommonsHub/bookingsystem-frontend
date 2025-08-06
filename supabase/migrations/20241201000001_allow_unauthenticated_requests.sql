-- Allow unauthenticated users to insert requests (for embeddable forms)
-- Drop the existing insert policy that requires authentication
DROP POLICY IF EXISTS "Users can insert their own requests" ON public.requests;

-- Create a new policy that allows unauthenticated inserts
DROP POLICY IF EXISTS "Allow unauthenticated request creation" ON public.requests;
CREATE POLICY "Allow unauthenticated request creation" ON public.requests
    FOR INSERT WITH CHECK (true);

-- Grant insert permissions to anon users
GRANT INSERT ON public.requests TO anon; 