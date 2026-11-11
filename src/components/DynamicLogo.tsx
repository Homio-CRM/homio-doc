'use client';

/** Logo do cabeçalho e da sidebar: grafite no tema claro, branca no escuro. */
export function DynamicLogo() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-completo-horizontal-grafite.png"
        alt="Homio"
        width={100}
        height={30}
        className="h-[30px] w-auto object-contain dark:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-homio.png"
        alt="Homio"
        width={100}
        height={30}
        className="hidden h-[30px] w-auto object-contain dark:inline-block"
      />
    </>
  );
}
