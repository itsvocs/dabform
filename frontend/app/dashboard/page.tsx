// dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { berichteApi } from '@/lib/api';
import DashboardClient from './dashboard-client';
import { Bericht, Patient } from '@/types';

export default function Dashboard() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [berichte, setBerichte] = useState<Bericht[]>([]);
    const [berichteLoading, setBerichteLoading] = useState(true);



    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            berichteApi.getAll()
                .then(setBerichte)
                .catch(console.error)
                .finally(() => setBerichteLoading(false));
        }
    }, [user]);

    if (loading || berichteLoading) {
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

    return <DashboardClient user={user} initialBerichte={berichte} />;
}