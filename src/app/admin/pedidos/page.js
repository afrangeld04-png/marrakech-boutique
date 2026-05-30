"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminPedidosPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const logged = localStorage.getItem("adminLogged");

    if (logged !== "true") {
      router.push("/admin/login");
      return;
    }

    loadOrders();
  }, [router]);

  const loadOrders = async () => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setOrders(data);
  };

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), {
      status,
    });

    await loadOrders();
  };

  return (
    <main className="min-h-screen bg-[#fbf5ea] p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-[#6f2b2f]"
          >
            <ArrowLeft size={18} />
            Volver al admin
          </Link>

          <Link
            href="/"
            className="rounded-full border border-[#6f2b2f] px-5 py-3 font-semibold text-[#6f2b2f]"
          >
            Volver a la tienda
          </Link>
        </div>

        <h1 className="font-serif text-6xl text-[#6f2b2f]">
          Historial de pedidos
        </h1>

        <p className="mt-3 text-[#2c2020]/70">
          Aquí aparecerán los pedidos enviados por WhatsApp.
        </p>

        <div className="mt-10 space-y-5">
          {orders.length === 0 ? (
            <p className="rounded-[2rem] bg-white p-6 text-[#2c2020]/60">
              Aún no hay pedidos registrados.
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl text-[#6f2b2f]">
                      {order.customerName}
                    </h2>
                    <p className="text-xl font-semibold text-[#2c2020]">
  WhatsApp: {order.customerPhone}
</p>
                  </div>

                  <select
                    value={order.status || "Pendiente"}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="rounded-xl border p-3 text-[#6f2b2f]"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Preparando">Preparando</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                  </select>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="font-bold text-[#6f2b2f]">Productos</p>
                    {order.items?.map((item, index) => (
                      <p key={index} className="text-[#2c2020]/70">
                        • {item.name} x{item.qty} - ${item.price * item.qty}
                      </p>
                    ))}
                  </div>

                  <div className="space-y-2 text-lg text-[#2c2020]">
  <p>
    <span className="font-bold text-[#6f2b2f]">Total:</span>{" "}
    ${order.total}
  </p>

  <p>
    <span className="font-bold text-[#6f2b2f]">Entrega:</span>{" "}
    {order.deliveryPlace}
  </p>

  <p>
    <span className="font-bold text-[#6f2b2f]">Envío:</span>{" "}
    {order.shippingMethod || "No aplica"}
  </p>

  <p>
    <span className="font-bold text-[#6f2b2f]">Pago:</span>{" "}
    {order.paymentMethod}
  </p>
</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}