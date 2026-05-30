"use client";

import { MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2c2020] px-6 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <h2 className="font-serif text-4xl">M. Atelier & Co.</h2>
          <p className="mt-2 text-white/50">
            Boutique only online · Envíos a toda la república
          </p>
        </div>

        <a
          href="https://wa.me/"
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 font-semibold text-[#6f2b2f]"
        >
          <MessageCircle size={18} />
          WhatsApp
        </a>
      </div>
    </footer>
  );
}