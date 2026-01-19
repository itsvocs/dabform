import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authApi } from '@/lib/api';
import ProfileClient from '@/components/profile-client';

export default async function ProfilePage() {
    // Server-Side: Session checken
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
        redirect('/login');
    }

    let user
    try {
        user = await authApi.getCurrentUser();
    } catch (error) {
        console.error('Profile error:', error);
        redirect('/login');
    }

    return <ProfileClient user={user} />;
}