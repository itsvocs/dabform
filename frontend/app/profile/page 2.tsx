'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import ProfileClient from '@/components/profile-client';

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center animate-pulse">
                    <p className="text-muted-foreground">Laden...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <ProfileClient user={user} />;
}