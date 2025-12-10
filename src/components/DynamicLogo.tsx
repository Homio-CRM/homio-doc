'use client';

export function DynamicLogo() {
    return (
        <>
            {/* Light mode logo - hidden in dark mode */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/logo-completo-horizontal-grafite.png"
                alt="Homio Logo"
                width={100}
                height={30}
                className="object-contain dark:hidden"
            />
            {/* Dark mode fallback - hidden in light mode */}
            <span className="font-medium hidden dark:inline">Homio Docs</span>
        </>
    );
}
