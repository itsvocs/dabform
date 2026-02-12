"use client"
import { useRouter } from "next/navigation";


export function HomeComponent() {
    const router = useRouter()
    return (
        <div className="relative py-32 w-screen  overflow-hidden">
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-linear-to-b from-white/40 dark:from-black/40 via-transparent to-white/60 dark:to-background/60 pointer-events-none" />

            {/* Hero content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
                <div className="max-w-4xl text-center">

                    {/* Title */}
                    <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-6xl md:text-8xl">
                        Digitaler Durchgangsarztbericht
                    </h1>

                    {/* Description */}
                    <p className="mx-auto mb-10 max-w-2xl text-sm text-black/60 dark:text-white/60 sm:text-xl">
                        Eine Plattform für die einfache Erstellung und Verwaltung digitaler Durchgangsarztberichte für Durchgangsärzte, von allen Geräten und überall erreichbar.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <button className="group relative inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black dark:bg-white px-8 text-base font-medium text-white dark:text-black transition-all hover:bg-black/90 hover:scale-105"
                            onClick={() => router.push("/login")}
                        >
                            Jetzt starten
                            <svg
                                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </button>
                        <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/20 bg-black/5 dark:bg-white/5 px-8 text-base font-medium text-black dark:text-white backdrop-blur-sm transition-all hover:bg-black/10 hover:border-black/30"
                            onClick={() => router.push("https://dabform.onrender.com/docs")}
                        >
                            Zur Dokumentation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}