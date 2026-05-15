import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SessionBadge } from "./_components/SessionBadge";

export const metadata: Metadata = {
  title: "Milán Bicicletas",
  description: "Ecommerce de bicicletas Milán",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <header className="bg-white border-b border-neutral-200 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Milán Bicicletas
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link
                href="/cart"
                className="text-neutral-700 hover:text-emerald-600 transition-colors"
              >
                Carrito
              </Link>
              <SessionBadge />
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
