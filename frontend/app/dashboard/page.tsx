'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, berichteApi } from '@/lib/api';
import type { User, Bericht } from '@/types';
import { logoutAction } from '../actions/auth';
import { Button } from '@/components/ui/button';
import { LogOut, FileText, UserCircle } from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [berichte, setBerichte] = useState<Bericht[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    console.log(user)
    console.log(berichte)
    const loadData = async () => {
        try {
            const [userData, berichteData] = await Promise.all([
                authApi.getCurrentUser(),
                berichteApi.getAll(),
            ]);

            setUser(userData);
            setBerichte(berichteData);
        } catch (err) {
            setError('Fehler beim Laden der Daten');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logoutAction();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Laden...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600">{error || 'Fehler beim Laden'}</p>
                    <Button onClick={() => router.push('/login')} className="mt-4">
                        Zum Login
                    </Button>
                </div>
            </div>
        );
    }

    const entwuerfe = berichte.filter(b => b.status === 'entwurf');
    const abgeschlossen = berichte.filter(b => b.status === 'abgeschlossen');

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">DAB-Form Dashboard</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Durchgangsarzt-Berichtssystem
                            </p>
                        </div>
                        <Button onClick={handleLogout} variant="outline" size="sm">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* User Info Card */}
                <div className="bg-card border rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <UserCircle className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold">
                                {user.titel ? `${user.titel} ` : ''}
                                {user.vorname} {user.nachname}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                {user.email}
                            </p>
                            <div className="flex gap-4 mt-3">
                                <div>
                                    <span className="text-xs text-muted-foreground">Rolle:</span>
                                    <p className="text-sm font-medium">
                                        {user.rolle === 'admin' ? 'Administrator' : 'Durchgangsarzt'}
                                    </p>
                                </div>
                                {user.durchgangsarzt_nr && (
                                    <div>
                                        <span className="text-xs text-muted-foreground">D-Arzt Nr.:</span>
                                        <p className="text-sm font-medium">{user.durchgangsarzt_nr}</p>
                                    </div>
                                )}
                                {user.praxis_name && (
                                    <div>
                                        <span className="text-xs text-muted-foreground">Praxis:</span>
                                        <p className="text-sm font-medium">{user.praxis_name}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistiken */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-card border rounded-lg p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{berichte.length}</p>
                                <p className="text-sm text-muted-foreground">Gesamt Berichte</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border rounded-lg p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/10 rounded">
                                <FileText className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{entwuerfe.length}</p>
                                <p className="text-sm text-muted-foreground">Entwürfe</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border rounded-lg p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded">
                                <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{abgeschlossen.length}</p>
                                <p className="text-sm text-muted-foreground">Abgeschlossen</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Berichte Liste */}
                <div className="bg-card border rounded-lg">
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold">Letzte Berichte</h3>
                    </div>
                    <div className="overflow-x-auto">
                        {berichte.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>Noch keine Berichte vorhanden</p>
                                <Button className="mt-4" onClick={() => router.push('/berichte/neu')}>
                                    Ersten Bericht erstellen
                                </Button>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                            Lfd. Nr.
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                            Patient ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                            Unfalltag
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                            Erstellt
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {berichte.slice(0, 10).map((bericht) => (
                                        <tr
                                            key={bericht.id}
                                            className="hover:bg-muted/50 cursor-pointer transition-colors"
                                            onClick={() => router.push(`/berichte/${bericht.id}`)}
                                        >
                                            <td className="px-6 py-4 text-sm font-medium">
                                                {bericht.lfd_nr}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {bericht.patient_id}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {new Date(bericht.unfalltag).toLocaleDateString('de-DE')}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bericht.status === 'abgeschlossen'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-orange-100 text-orange-800'
                                                        }`}
                                                >
                                                    {bericht.status === 'abgeschlossen' ? 'Abgeschlossen' : 'Entwurf'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {new Date(bericht.erstellt_am).toLocaleDateString('de-DE')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}