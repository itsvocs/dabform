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
import { ChevronDown, LogOut, Moon, Sun } from 'lucide-react';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useTheme } from 'next-themes';

export default function Header() {
    const { setTheme } = useTheme()
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
                    <Link href={user ? "/dashboard" : "/"} className="-m-1.5 p-1.5 flex items-center space-x-2">
                        <Logo className="h-8 w-auto" />
                        <span className="text-2xl font-medium text-foreground/70 dark:text-foreground">Dabform</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {loading ? (
                        <div className="h-4 w-20 animate-pulse bg-muted rounded" />
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
                                <span className='sr-only sm:not-sr-only'>Sich</span>{" "}anmelden
                            </Button>
                        </Link>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </header>
    );
}