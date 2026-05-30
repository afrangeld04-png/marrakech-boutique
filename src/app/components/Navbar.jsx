"use client";

import Link from "next/link";
import { ShoppingBag, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#6f2b2f]/10 bg-[#fbf5ea]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full border border-[#6f2b2f]/20 bg-white font-serif text-2xl text-[#6f2b2f] shadow-sm">
            M
          </div>

          <div>
            <h1 className="font-serif text-2xl tracking-wide text-[#6f2b2f]">
              M. Atelier & Co.
            </h1>
            <p className="text-xs uppercase tracking-[0.45em] text-[#6f2b2f]/60">
              Boutique only online
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-9 text-sm font-medium text-[#2c2020]/80 md:flex">
          <a href="#coleccion" className="hover:text-[#6f2b2f]">
            Colección
          </a>
          <a href="#categorias" className="hover:text-[#6f2b2f]">
            Categorías
          </a>
          <a href="#reglas" className="hover:text-[#6f2b2f]">
            Reglas
          </a>
          <a href="#entregas" className="hover:text-[#6f2b2f]">
            Entregas
          </a>
          <Link href="/admin" className="hover:text-[#6f2b2f]">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-full border border-[#6f2b2f]/20 px-5 py-3 text-sm font-semibold text-[#6f2b2f] md:block">
            WhatsApp
          </button>

          <button className="grid h-12 w-12 place-items-center rounded-full bg-[#6f2b2f] text-white shadow-lg shadow-[#6f2b2f]/20">
            <ShoppingBag size={20} />
          </button>

          <button className="grid h-12 w-12 place-items-center rounded-full border border-[#6f2b2f]/15 text-[#6f2b2f] md:hidden">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}