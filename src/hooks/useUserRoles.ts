import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

export type UserRole = 'admin' | 'moderator' | 'support' | 'user';

export interface UserWithRoles extends User {
  roles: UserRole[];
}

export const useUserRoles = (user: User | null) => {
  const [userWithRoles, setUserWithRoles] = useState<UserWithRoles | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setUserWithRoles(null);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user roles:', error);
          setUserWithRoles({ ...user, roles: [] });
        } else {
          const roles = data?.map(row => row.role as UserRole) || [];
          setUserWithRoles({ ...user, roles });
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setUserWithRoles({ ...user, roles: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  const hasRole = (role: UserRole): boolean => {
    return userWithRoles?.roles.includes(role) || false;
  };

  const hasPermission = (permission: string): boolean => {
    // For now, we'll implement a simple permission check
    // In a full implementation, you'd query the role_permissions table
    if (hasRole('admin')) return true;
    if (hasRole('moderator') && permission.startsWith('requests.') || permission.startsWith('comments.')) return true;
    if (hasRole('support') && permission.startsWith('requests.')) return true;
    return false;
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  return {
    userWithRoles,
    loading,
    hasRole,
    hasPermission,
    isAdmin,
  };
}; 