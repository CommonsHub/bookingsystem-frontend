-- Migration: Migrate existing admin users to RBAC system
-- This migration identifies users with admin in their full_name and assigns them the admin role

-- Insert admin role for users who have 'admin' in their full_name
INSERT INTO public.user_roles (user_id, role)
SELECT 
    p.id as user_id,
    'admin' as role
FROM public.profiles p
WHERE p.full_name LIKE '%admin%'
AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = p.id AND ur.role = 'admin'
);

-- Log the migration results
DO $$
DECLARE
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_count
    FROM public.user_roles 
    WHERE role = 'admin';
    
    RAISE NOTICE 'Migrated % users to admin role', admin_count;
END $$; 