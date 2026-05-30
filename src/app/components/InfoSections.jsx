"use client";

import { CreditCard, MapPin, ShieldCheck, ReceiptText } from "lucide-react";

const rules = [
  "Todo se pide con anticipo previo.",
  "No hay cambios ni devoluciones.",
  "Pago de contado o contra entrega.",
  "No hay apartados sin depósito.",
  "Envía tu comprobante forzosamente.",
  "Pregunta disponibilidad antes de depositar.",
  "Revisa tu mercancía al momento de entrega.",
  "No se realizan reembolsos.",
];

const deliveryPoints = [
  "Cualquier estación Mexibús L2 y L1",
  "UVM Hispano",
  "ETAC Zarzaparrillas",
  "Visma Gym",
  "Mercado de Villa",
  "Canosas",
];

export default function InfoSections() {
  return (
    <>
      <section id="reglas" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl rounded-[3rem] bg-[#6f2b2f] p-8 text-white md:p-14">
          <div className="mb-12 flex items-center gap-3">
            <ReceiptText />
            <h2 className="font-serif text-5xl">Reglas en M. Atelier</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            {rules.map((rule, index) => (
              <div
                key={rule}
                className="rounded-[2rem] border border-white/15 bg-white/10 p-6"
              >
                <p className="mb-5 font-serif text-4xl text-white/50">
                  0{index + 1}
                </p>
                <p className="leading-7">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="entregas" className="bg-[#fbf5ea] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-7 md:grid-cols-3">
          <div className="rounded-[3rem] bg-white p-9 shadow-xl shadow-black/5">
            <CreditCard className="mb-6 text-[#6f2b2f]" />

            <h2 className="font-serif text-4xl text-[#6f2b2f]">
              Métodos de pago
            </h2>

            <div className="mt-8 space-y-4">
              <p className="rounded-2xl bg-[#fbf5ea] p-5 font-semibold">
                Transferencia
              </p>
              <p className="rounded-2xl bg-[#fbf5ea] p-5 font-semibold">
                Efectivo
              </p>
            </div>
          </div>

          <div className="rounded-[3rem] bg-white p-9 shadow-xl shadow-black/5 md:col-span-2">
            <MapPin className="mb-6 text-[#6f2b2f]" />

            <h2 className="font-serif text-4xl text-[#6f2b2f]">
              Puntos de entrega
            </h2>

            <p className="mt-3 text-[#2c2020]/60">
              Entregas solo en los puntos acordados.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {deliveryPoints.map((point) => (
                <p
                  key={point}
                  className="rounded-2xl border border-[#6f2b2f]/10 bg-[#fbf5ea] p-5 font-medium"
                >
                  {point}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="politicas" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl rounded-[3rem] border border-[#6f2b2f]/10 bg-[#fbf5ea] p-9 md:p-14">
          <div className="mb-8 flex items-center gap-3 text-[#6f2b2f]">
            <ShieldCheck />
            <h2 className="font-serif text-5xl">Nuestras políticas</h2>
          </div>

          <div className="space-y-5 text-lg leading-9 text-[#2c2020]/70">
            <p>
              Todo pedido se realiza con un depósito del 50% del total y se
              liquida antes o contra entrega.
            </p>
            <p>
              No hay cambios, devoluciones ni reembolsos. Pide con
              responsabilidad.
            </p>
            <p>
              Una vez autorizado el ticket de compra, el pedido se realiza tal y
              como está indicado.
            </p>
            <p>
              Cuentas con 10 minutos de tolerancia en la entrega agendada. Si no
              llegas, se reagenda sin prioridad.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}