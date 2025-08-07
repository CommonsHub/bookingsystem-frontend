-- Create requests table
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    request_type TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by_email TEXT NOT NULL,
    created_by_name TEXT,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    organization TEXT,
    expected_completion_date TIMESTAMP WITH TIME ZONE,
    additional_details TEXT,
    attachments TEXT[],
    language TEXT DEFAULT 'en',
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by_email TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by_email TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_requests_created_by_email ON public.requests(created_by_email);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON public.requests(created_at);
CREATE INDEX IF NOT EXISTS idx_requests_request_type ON public.requests(request_type);
CREATE INDEX IF NOT EXISTS idx_requests_priority ON public.requests(priority);

-- Enable Row Level Security (RLS)
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can view their own requests
DROP POLICY IF EXISTS "Users can view their own requests" ON public.requests;
CREATE POLICY "Users can view their own requests" ON public.requests
    FOR SELECT USING (auth.jwt() ->> 'email' = created_by_email);

-- Users can insert their own requests
DROP POLICY IF EXISTS "Users can insert their own requests" ON public.requests;
CREATE POLICY "Users can insert their own requests" ON public.requests
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = created_by_email);

-- Users can update their own requests
DROP POLICY IF EXISTS "Users can update their own requests" ON public.requests;
CREATE POLICY "Users can update their own requests" ON public.requests
    FOR UPDATE USING (auth.jwt() ->> 'email' = created_by_email);

-- Users can delete their own requests (if needed)
DROP POLICY IF EXISTS "Users can delete their own requests" ON public.requests;
CREATE POLICY "Users can delete their own requests" ON public.requests
    FOR DELETE USING (auth.jwt() ->> 'email' = created_by_email);

-- Admins can view all requests (you may need to adjust this based on your admin role setup)
DROP POLICY IF EXISTS "Admins can view all requests" ON public.requests;
CREATE POLICY "Admins can view all requests" ON public.requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.full_name LIKE '%admin%'
        )
    );

-- Admins can update all requests
DROP POLICY IF EXISTS "Admins can update all requests" ON public.requests;
CREATE POLICY "Admins can update all requests" ON public.requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.full_name LIKE '%admin%'
        )
    );

-- Grant necessary permissions
GRANT ALL ON public.requests TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 