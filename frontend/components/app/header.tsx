'use client';

import Logo from '../utils/logo';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Menu,
    MenuGroup,
    MenuItem,
    MenuPopup,
    MenuSeparator,
    MenuTrigger,
} from "@/components/ui/menu";
import { logoutAction } from '@/app/actions/auth';
import { useAuth } from '@/contexts/auth-context';
import { ChevronDown, LogOut } from 'lucide-react';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading, logout } = useAuth();

    const handleLogout = async () => {
        logout();
        await logoutAction();
    };

    return (
        <header className="border-b bg-background">
            <nav className="mx-auto flex max-w-[1300px] items-center justify-between p-6 lg:px-8">
                <div className="flex">
                    <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
                        <Logo className="h-8 w-auto" />
                        <span className="text-2xl font-medium text-foreground/70">Dabform</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {loading ? (
                        <div className="h-8 w-20 animate-pulse bg-muted rounded" />
                    ) : user ? (
                        <Menu>
                            <MenuTrigger render={<Button variant="ghost" />}>Dr.{" "} {user.vorname} {" "} {user.nachname}
                                <ChevronDown className='size-4' />
                            </MenuTrigger>
                            <MenuPopup>
                                <MenuGroup>
                                    <Link href="/profile">
                                        <MenuItem>Profil</MenuItem>
                                    </Link>
                                    <Link href="/profile/edit">
                                        <MenuItem>Konto verwalten</MenuItem>
                                    </Link>
                                    <Link href="/passwort">
                                        <MenuItem>Password ändern</MenuItem>
                                    </Link>
                                </MenuGroup>
                                <MenuSeparator />
                                <MenuGroup>
                                    {pathname !== '/dashboard' && (
                                        <MenuItem onClick={() => router.push('/dashboard')}>
                                            Dashboard
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={handleLogout} ><LogOut className='size-4' /> Abmelden</MenuItem>
                                </MenuGroup>
                            </MenuPopup>
                        </Menu>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost">
                                Sich anmelden
                            </Button>
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}