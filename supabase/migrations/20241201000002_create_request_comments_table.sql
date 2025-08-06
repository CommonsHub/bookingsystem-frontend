-- Create request comments table
CREATE TABLE IF NOT EXISTS public.request_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by_email TEXT NOT NULL,
    created_by_name TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_request_comments_request_id ON public.request_comments(request_id);
CREATE INDEX IF NOT EXISTS idx_request_comments_created_at ON public.request_comments(created_at);
CREATE INDEX IF NOT EXISTS idx_request_comments_created_by_email ON public.request_comments(created_by_email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.request_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can view comments for requests they can access
DROP POLICY IF EXISTS "Users can view request comments" ON public.request_comments;
CREATE POLICY "Users can view request comments" ON public.request_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.requests 
            WHERE requests.id = request_comments.request_id 
            AND (requests.created_by_email = auth.jwt() ->> 'email' OR 
                 EXISTS (
                     SELECT 1 FROM public.profiles 
                     WHERE profiles.id = auth.uid() 
                     AND profiles.full_name LIKE '%admin%'
                 ))
        )
    );

-- Users can insert comments for requests they can access
DROP POLICY IF EXISTS "Users can insert request comments" ON public.request_comments;
CREATE POLICY "Users can insert request comments" ON public.request_comments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.requests 
            WHERE requests.id = request_comments.request_id 
            AND (requests.created_by_email = auth.jwt() ->> 'email' OR 
                 EXISTS (
                     SELECT 1 FROM public.profiles 
                     WHERE profiles.id = auth.uid() 
                     AND profiles.full_name LIKE '%admin%'
                 ))
        )
    );

-- Users can update their own comments
DROP POLICY IF EXISTS "Users can update their own request comments" ON public.request_comments;
CREATE POLICY "Users can update their own request comments" ON public.request_comments
    FOR UPDATE USING (created_by_email = auth.jwt() ->> 'email');

-- Users can delete their own comments
DROP POLICY IF EXISTS "Users can delete their own request comments" ON public.request_comments;
CREATE POLICY "Users can delete their own request comments" ON public.request_comments
    FOR DELETE USING (created_by_email = auth.jwt() ->> 'email');

-- Grant necessary permissions
GRANT ALL ON public.request_comments TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 