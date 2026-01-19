'use client'

import Logo from '../utils/logo'
import Link from 'next/link'


export default function Header() {

    return (
        <header className="">
            <nav aria-label="Global" className="mx-auto flex max-w-[1300px] items-center justify-between p-6 lg:px-8">
                <div className="flex ">
                    <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
                        <Logo className="h-8 w-auto" />
                        <span className="text-2xl font-medium text-foreground/70">Dabform</span>
                    </Link>
                </div>
                <div className="flex">
                    <Link href="/login" className="text-foreground0">
                        Sich anmelden
                    </Link>
                </div>
            </nav>
        </header>
    )
}
