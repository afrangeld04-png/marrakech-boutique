"use client";

import { motion } from "framer-motion";
import { Sparkles, MessageCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fbf5ea] px-6 py-20 md:py-28">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#d9b9ae]/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#6f2b2f]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#6f2b2f]/20 bg-white/50 px-5 py-2 text-sm text-[#6f2b2f]">
            <Sparkles size={16} />
            Luxury boutique · Only online
          </div>

          <h2 className="font-serif text-6xl leading-[0.95] text-[#6f2b2f] md:text-8xl">
            M. Atelier & Co.
          </h2>

          <p className="mt-6 max-w-xl text-xl leading-8 text-[#2c2020]/70">
            Joyería, maquillaje, ropa y accesorios seleccionados con una vibra
            clean, femenina y minimalista.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              href="#coleccion"
              className="rounded-full bg-[#6f2b2f] px-8 py-4 text-center font-semibold text-white shadow-xl shadow-[#6f2b2f]/20"
            >
              Ver colección
            </a>

            <a
              href="https://wa.me/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#6f2b2f]/20 bg-white/60 px-8 py-4 font-semibold text-[#6f2b2f]"
            >
              <MessageCircle size={18} />
              Comprar por WhatsApp
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative grid grid-cols-2 gap-5"
        >
          <div className="space-y-5">
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
              alt="Maquillaje boutique"
              className="h-72 w-full rounded-[2.5rem] object-cover shadow-2xl shadow-[#6f2b2f]/10"
            />
            <img
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d"
              alt="Joyería boutique"
              className="h-52 w-full rounded-[2.5rem] object-cover shadow-2xl shadow-[#6f2b2f]/10"
            />
          </div>

          <div className="mt-12 space-y-5">
            <img
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348"
              alt="Brochas de maquillaje"
              className="h-52 w-full rounded-[2.5rem] object-cover shadow-2xl shadow-[#6f2b2f]/10"
            />
            <img
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3"
              alt="Bolso boutique"
              className="h-72 w-full rounded-[2.5rem] object-cover shadow-2xl shadow-[#6f2b2f]/10"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}