import Link from 'next/link'

const links: { title: string, href: string }[] = [
    {
        title: 'Gitlab',
        href: 'https://gitlab.ges.thm.de/lehre/swtp/wise2526/g1_dabform',
    }, {
        title: 'Github',
        href: 'https://gitlab.ges.thm.de/lehre/swtp/wise2526/g1_dabform',
    },
    {
        title: 'Dabform V1.0.0',
        href: 'https://gitlab.ges.thm.de/lehre/swtp/wise2526/g1_dabform',
    },
]

export default function Footer() {
    return (
        <footer className="border-b bg-white py-4 dark:bg-transparent">
            <div className="mx-auto max-w-[1300px] px-2">
                <div className="flex flex-wrap justify-between gap-6">
                    <span className="text-muted-foreground order-last block text-center text-sm md:order-first">© {new Date().getFullYear()} Dabform, Alle Rechte vorbehalten</span>
                    <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="text-muted-foreground hover:text-primary block duration-150">
                                <span>{link.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}