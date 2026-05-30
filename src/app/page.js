"use client";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./lib/firebase";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Search, Heart, Sparkles, Smartphone, Shirt, Gem,
  Palette, MapPin, CreditCard, ShieldCheck, MessageCircle, Plus,
  Minus, X, Star, PackageCheck, Truck, ReceiptText, Lock
} from "lucide-react";

const initialProducts = [
  {
    id: "1",
    name: "Funda Rhode lip tint",
    category: "Accesorios celular",
    price: 289,
    stock: 8,
    tag: "Más pedido",
    description: "Funda aesthetic con espacio para lip tint. Disponible en varios modelos de iPhone.",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "2",
    name: "Gloss Rhode set",
    category: "Maquillaje",
    price: 249,
    stock: 12,
    tag: "Glow",
    description: "Gloss tonos rosados y nude, acabado glossy natural.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "3",
    name: "Lip oil cherry",
    category: "Maquillaje",
    price: 199,
    stock: 15,
    tag: "Nuevo",
    description: "Lip oil hidratante con color suave. Ideal para uso diario.",
    image: "https://images.unsplash.com/photo-1631214540242-3cd8cbe2d307?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "4",
    name: "Bolsa tote Chloe inspired",
    category: "Ropa y bolsas",
    price: 549,
    stock: 5,
    tag: "Stock limitado",
    description: "Bolsa tipo tote con diseño minimalista. Perfecta para outfit casual.",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "5",
    name: "Cosmetiquera clean girl",
    category: "Accesorios",
    price: 179,
    stock: 10,
    tag: "Disponible",
    description: "Cosmetiquera compacta para maquillaje, skincare o básicos del día.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "6",
    name: "Pulsera gold minimal",
    category: "Joyería",
    price: 159,
    stock: 18,
    tag: "Aesthetic",
    description: "Pulsera dorada delicada para combinar con todos tus outfits.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "7",
    name: "Lanyard Miu inspired",
    category: "Accesorios celular",
    price: 229,
    stock: 7,
    tag: "Trend",
    description: "Correa para celular en tonos neutros y rosa. Cómoda y aesthetic.",
    image: "https://images.unsplash.com/photo-1601972602288-3be527b4f18a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "8",
    name: "Aretes perla soft",
    category: "Joyería",
    price: 139,
    stock: 20,
    tag: "Básico",
    description: "Aretes con perla sintética, elegantes y ligeros.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
  },
];

const categories = [
  "Todo",
  "Joyería",
  "Ropa y bolsas",
  "Maquillaje",
  "Accesorios celular",
  "Accesorios",
];

const rules = [
  "Todo se pide con anticipo previo.",
  "No hay cambios.",
  "Pago de contado o contra entrega.",
  "No hay apartados sin depósito.",
  "Envía tu comprobante.",
  "Pregunta disponibilidad antes de depositar.",
  "Revisa tu mercancía al momento de entrega.",
  "No hay reembolsos.",
];

const deliveryPoints = [
  "Cualquier estación Mexibús L2 y L1",
  "UVM Hispano",
  "ETAC Zarzaparrillas",
  "Visma Gym",
  "Mercado de Villa",
  "Canosas",
];

function money(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export default function Home() {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todo");
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const [deliveryPlace, setDeliveryPlace] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const router = useRouter();

const [logoClicks, setLogoClicks] = useState(0);

function handleSecretAdmin() {
  const nextClicks = logoClicks + 1;
  setLogoClicks(nextClicks);

  if (nextClicks >= 5) {
    setLogoClicks(0);
    router.push("/admin/login");
  }
}

  useEffect(() => {
  async function loadProducts() {
    try {
      const snapshot = await getDocs(collection(db, "products"));

      const firebaseProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        tag: "Nuevo",
        ...doc.data(),
      }));

      setProducts(firebaseProducts);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }

  const savedCart = localStorage.getItem("boutique_cart");
  if (savedCart) setCart(JSON.parse(savedCart));

  loadProducts();
}, []);


  useEffect(() => {
    localStorage.setItem("boutique_cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "Todo" || product.category === category;

      const matchesSearch =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, category, query]);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  function addToCart(product) {
    setCart((current) => {
      const exists = current.find((item) => item.id === product.id);

      if (exists) {
        return current.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...current, { ...product, qty: 1 }];
    });

    setCartOpen(true);
  }

  function changeQty(id, qty) {
    if (qty <= 0) {
      setCart((current) => current.filter((item) => item.id !== id));
      return;
    }

    setCart((current) =>
      current.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  }
const sendOrder = async () => {
  try {
    await addDoc(collection(db, "orders"), {
      customerName,
      customerPhone,
      deliveryPlace,
      shippingMethod,
      paymentMethod,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      total,
      status: "Pendiente",
      createdAt: serverTimestamp(),
    });

    for (const item of cart) {
      const productRef = doc(db, "products", item.id);
      const newStock = Number(item.stock) - Number(item.qty);

      await updateDoc(productRef, {
        stock: newStock < 0 ? 0 : newStock,
      });
    }

    window.location.href = `https://wa.me/525524817183?text=${whatsappText}`;
  } catch (error) {
    console.error(error);
    alert("Error al guardar el pedido o actualizar stock.");
  }
};
  const whatsappText = encodeURIComponent(
  `Hola, quiero hacer un pedido en M. Atelier & Co.:

${cart
  .map(
    (item) =>
      `• ${item.name} x${item.qty} - ${money(item.price * item.qty)}`
  )
  .join("\n")}

Total aproximado: ${money(total)}

Datos del cliente:
Nombre: ${customerName}
Número: ${customerPhone}

Entrega:
Lugar de entrega: ${deliveryPlace}
${deliveryPlace === "Ninguno" ? `Envío por: ${shippingMethod}` : ""}

Forma de pago: ${paymentMethod}

${paymentMethod === "Transferencia"
  ? `Datos de transferencia:
728969000150185324
SPIN BY OXXO
Alessandra Reséndiz Díaz`
  : ""}

¿Me confirmas disponibilidad?`
);

  return (
    <div className="min-h-screen bg-[#fbf5ea] text-[#2c2020]">
      <header className="sticky top-0 z-40 border-b border-[#6f2b2f]/10 bg-[#fbf5ea]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
           <button onClick={handleSecretAdmin}
           className="grid h-12 w-12 place-items-center rounded-full border border-[#6f2b2f]/20 bg-white font-serif text-xl text-[#6f2b2f]"
           >
             M
             </button>

            <div>
              <h1 className="font-serif text-xl tracking-wide text-[#6f2b2f]">
                M. Atelier & Co.
              </h1>
              <p className="text-xs uppercase tracking-[0.3em] text-[#6f2b2f]/70">
                Boutique only online
              </p>
            </div>
          </div>

          <nav className="hidden gap-7 text-sm font-medium md:flex">
            <a href="#productos">Productos</a>
            <a href="#reglas">Reglas</a>
            <a href="#entregas">Entregas</a>
            <a href="#politicas">Políticas</a>
          </nav>

          <button
            onClick={() => setCartOpen(true)}
            className="relative rounded-full bg-[#6f2b2f] p-3 text-white"
          >
            <ShoppingBag size={20} />

            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-bold text-[#6f2b2f]">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-5 py-16 md:py-24">
          <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-[#d9b9ae]/40 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#6f2b2f]/10 blur-3xl" />

          <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#6f2b2f]/20 bg-white/60 px-4 py-2 text-sm text-[#6f2b2f]">
                <Sparkles size={16} />
                Actualizaciones semanales · Stock limitado
              </div>

              <h2 className="font-serif text-5xl leading-tight text-[#6f2b2f] md:text-7xl">
                M. Atelier & Co.Luxury Boutique Only Online
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#2c2020]/70">
                Joyería, ropa, maquillaje y accesorios para celular con una
                experiencia minimalista, elegante y fácil de usar.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#productos"
                  className="rounded-full bg-[#6f2b2f] px-7 py-4 text-center font-semibold text-white"
                >
                  Ver colección
                </a>

                <a
                  href="#politicas"
                  className="rounded-full border border-[#6f2b2f]/20 bg-white/50 px-7 py-4 text-center font-semibold text-[#6f2b2f]"
                >
                  Leer políticas
                </a>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {products.slice(0, 4).map((item, index) => (
                <motion.button
                  key={item.id}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelected(item)}
                  className={`overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-[#6f2b2f]/10 ${
                    index === 1 ? "mt-10" : ""
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-4 text-left">
                    <p className="font-serif text-xl text-[#6f2b2f]">
                      {item.name}
                    </p>
                    <p className="text-sm text-[#2c2020]/60">
                      {money(item.price)}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-12">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
            {[
              [Gem, "Joyería", "Piezas delicadas y combinables"],
              [Palette, "Maquillaje", "Gloss, lip oil y tonos virales"],
              [Smartphone, "Celular", "Fundas y accesorios aesthetic"],
              [Shirt, "Ropa", "Bolsas, prendas y básicos cute"],
            ].map(([Icon, title, text]) => (
              <div
                key={title}
                className="rounded-[2rem] border border-[#6f2b2f]/10 bg-white/40 p-6"
              >
                <Icon className="mb-5 text-[#6f2b2f]" />
                <h3 className="font-serif text-2xl text-[#6f2b2f]">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-[#2c2020]/65">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="productos" className="px-5 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-sm uppercase tracking-[0.35em] text-[#6f2b2f]/70">
                  Disponibles
                </p>
                <h2 className="font-serif text-5xl text-[#6f2b2f]">
                  Shop the drop
                </h2>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[#6f2b2f]/15 bg-white/60 px-4 py-3">
                <Search size={18} className="text-[#6f2b2f]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar producto..."
                  className="w-full bg-transparent outline-none placeholder:text-[#2c2020]/40 md:w-64"
                />
              </div>
            </div>

            <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold ${
                    category === cat
                      ? "bg-[#6f2b2f] text-white"
                      : "border border-[#6f2b2f]/15 bg-white/50 text-[#6f2b2f]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((item) => (
                <motion.article
                  layout
                  key={item.id}
                  className="group overflow-hidden rounded-[2rem] bg-white shadow-lg shadow-[#6f2b2f]/10"
                >
                  <button
                    onClick={() => setSelected(item)}
                    className="relative block w-full overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                   <span
                   className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                    Number(item.stock) <= 0
                    ? "bg-red-100 text-red-700"
                    : "bg-[#fbf5ea]/90 text-[#6f2b2f]"
               }`}
            >
              {Number(item.stock) <= 0 ? "Agotado" : item.tag}
            </span>

                  </button>

                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#6f2b2f]/60">
                          {item.category}
                        </p>
                        <h3 className="mt-1 font-serif text-2xl text-[#6f2b2f]">
                          {item.name}
                        </h3>
                      </div>

                      <button className="rounded-full border border-[#6f2b2f]/10 p-2 text-[#6f2b2f]">
                        <Heart size={18} />
                      </button>
                    </div>

                    <p className="line-clamp-2 text-sm text-[#2c2020]/60">
                      {item.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className="font-bold">{money(item.price)}</p>
                        <p className="text-xs text-[#2c2020]/45">
                          Stock: {item.stock}
                        </p>
                      </div>

                      {Number(item.stock) <= 0 ? (
                        <span className="rounded-full bg-red-100 px-4 py-3 text-sm font-semibold text-red-700">
                          Agotado
                        </span>
                      ) : ( 
                       <button
                       onClick={() => addToCart(item)}
                       className="rounded-full bg-[#6f2b2f] px-4 py-3 text-sm font-semibold text-white"
                    >
                      Agregar
                    </button>
                  )}
                  
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="reglas" className="px-5 py-16">
          <div className="mx-auto max-w-7xl rounded-[3rem] bg-[#6f2b2f] p-6 text-white md:p-12">
            <div className="mb-10 flex items-center gap-3">
              <ReceiptText />
              <h2 className="font-serif text-5xl">Reglas de compra</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {rules.map((rule, index) => (
                <div
                  key={rule}
                  className="rounded-[2rem] border border-white/10 bg-white/10 p-5"
                >
                  <p className="mb-4 font-serif text-3xl text-white/60">
                    0{index + 1}
                  </p>
                  <p className="leading-7">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="entregas" className="px-5 py-16">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            <div className="rounded-[3rem] bg-white p-8 shadow-lg shadow-[#6f2b2f]/10">
              <CreditCard className="mb-6 text-[#6f2b2f]" />
              <h2 className="font-serif text-4xl text-[#6f2b2f]">
                Métodos de pago
              </h2>

              <div className="mt-8 space-y-3">
                <p className="rounded-2xl bg-[#fbf5ea] p-4 font-semibold">
                  Transferencia
                </p>
                <p className="rounded-2xl bg-[#fbf5ea] p-4 font-semibold">
                  Efectivo
                </p>
              </div>
            </div>

            <div className="rounded-[3rem] bg-white p-8 shadow-lg shadow-[#6f2b2f]/10 md:col-span-2">
              <MapPin className="mb-6 text-[#6f2b2f]" />
              <h2 className="font-serif text-4xl text-[#6f2b2f]">
                Puntos de entrega
              </h2>

              <p className="mt-3 text-[#2c2020]/60">
                Entregas solo en los puntos acordados.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {deliveryPoints.map((point) => (
                  <p
                    key={point}
                    className="rounded-2xl border border-[#6f2b2f]/10 bg-[#fbf5ea] p-4 font-medium"
                  >
                    {point}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="politicas" className="px-5 py-16">
          <div className="mx-auto max-w-7xl rounded-[3rem] border border-[#6f2b2f]/10 bg-white/50 p-8 md:p-12">
            <div className="mb-8 flex items-center gap-3 text-[#6f2b2f]">
              <ShieldCheck />
              <h2 className="font-serif text-5xl">Nuestras políticas</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                [
                  Lock,
                  "Anticipo 50%",
                  "Todo pedido requiere depósito del 50% y liquidación antes o contra entrega.",
                ],
                [
                  PackageCheck,
                  "Ticket de compra",
                  "El pedido se toma en cuenta cuando se envía el ticket y se autoriza como está.",
                ],
                [
                  Truck,
                  "Tolerancia",
                  "Tienes 10 minutos de tolerancia en tu entrega agendada. Después se reagenda sin prioridad.",
                ],
              ].map(([Icon, title, text]) => (
                <div key={title} className="rounded-[2rem] bg-[#fbf5ea] p-6">
                  <Icon className="mb-5 text-[#6f2b2f]" />
                  <h3 className="font-serif text-3xl text-[#6f2b2f]">
                    {title}
                  </h3>
                  <p className="mt-3 leading-7 text-[#2c2020]/65">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 rounded-[2rem] bg-[#2c2020] px-6 py-7 text-white md:flex-row">
          <div>
            <p className="font-serif text-3xl">M. Atelier & Co.</p>
            <p className="text-white/50">
              @marrakechand.co · Envíos a toda la república
            </p>
          </div>

          <a
            href="https://wa.me/?text=Hola%20quiero%20informes%20de%20M.%20Atelier%20%26%20Co."
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-[#6f2b2f]"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
        </div>
      </footer>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="grid max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[3rem] bg-[#fbf5ea] shadow-2xl md:grid-cols-2"
            >
              <img
                src={selected.image}
                alt={selected.name}
                className="h-80 w-full object-cover md:h-full"
              />

              <div className="overflow-y-auto p-8">
                <button
                  onClick={() => setSelected(null)}
                  className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-white text-[#6f2b2f]"
                >
                  <X />
                </button>

                <p className="mt-4 text-sm uppercase tracking-[0.25em] text-[#6f2b2f]/60">
                  {selected.category}
                </p>

                <h3 className="mt-2 font-serif text-5xl text-[#6f2b2f]">
                  {selected.name}
                </h3>

                <p className="mt-4 text-2xl font-bold">
                  {money(selected.price)}
                </p>

                <p className="mt-5 leading-8 text-[#2c2020]/70">
                  {selected.description}
                </p>

                <div className="mt-6 rounded-[2rem] bg-white p-5">
                  <p className="flex items-center gap-2 font-semibold text-[#6f2b2f]">
                    <Star size={18} />
                    Antes de pedir
                  </p>
                  <p className="mt-2 text-sm text-[#2c2020]/60">
                    Pregunta disponibilidad antes de depositar. Stock limitado.
                  </p>
                </div>

                <button
                  onClick={() => addToCart(selected)}
                  className="mt-6 w-full rounded-full bg-[#6f2b2f] px-6 py-4 font-semibold text-white"
                >
                  Agregar al carrito
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-[#fbf5ea] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-4xl text-[#6f2b2f]">
                Tu pedido
              </h2>

              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full bg-white p-3 text-[#6f2b2f]"
              >
                <X />
              </button>
            </div>

            <div className="mt-8 space-y-4">
              {cart.length === 0 && (
                <p className="rounded-[2rem] bg-white p-6 text-center text-[#2c2020]/60">
                  Tu carrito está vacío.
                </p>
              )}

              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-[2rem] bg-white p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-[#6f2b2f]">
                      {item.name}
                    </p>
                    <p className="text-sm text-[#2c2020]/60">
                      {money(item.price)}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => changeQty(item.id, item.qty - 1)}
                        className="rounded-full border p-1"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="w-7 text-center text-sm font-bold">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => changeQty(item.id, item.qty + 1)}
                        className="rounded-full border p-1"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 max-h-[55vh] overflow-y-auto bg-[#fbf5ea] p-6">
  <div className="space-y-4">
    <div className="rounded-[2rem] bg-white p-5">
      <h3 className="mb-3 font-serif text-2xl text-[#6f2b2f]">
        1. Lugar de entrega
      </h3>

      <select
        value={deliveryPlace}
        onChange={(e) => {
          setDeliveryPlace(e.target.value);
          setShippingMethod("");
        }}
        className="w-full rounded-2xl border border-[#6f2b2f]/20 bg-white p-3 text-[#6f2b2f] outline-none"
      >
        <option value="">Selecciona un lugar</option>
        <option value="Cualquier estación Mexibús L2 y L1">
          Cualquier estación Mexibús L2 y L1
        </option>
        <option value="UVM Hispano">UVM Hispano</option>
        <option value="ETAC Zarzaparrillas">ETAC Zarzaparrillas</option>
        <option value="Visma Gym">Visma Gym</option>
        <option value="Mercado de Villa">Mercado de Villa</option>
        <option value="Canosas">Canosas</option>
        <option value="Ninguno">Ninguno</option>
      </select>

      {deliveryPlace === "Ninguno" && (
        <div className="mt-4 rounded-2xl border border-[#6f2b2f]/10 bg-[#fbf5ea] p-4">
          <label className="mb-2 block font-semibold text-[#6f2b2f]">
            Envío por
          </label>

          <select
            value={shippingMethod}
            onChange={(e) => setShippingMethod(e.target.value)}
            className="w-full rounded-2xl border border-[#6f2b2f]/20 bg-white p-3 text-[#6f2b2f] outline-none"
          >
            <option value="">Selecciona una opción</option>
            <option value="Uber">Uber</option>
            <option value="Didi">Didi</option>
          </select>

          <p className="mt-3 text-sm leading-6 text-[#2c2020]/65">
            El precio del envío es acuerdo a donde se envía el producto y el
            cliente paga el transporte.
          </p>
        </div>
      )}
    </div>

    <div className="rounded-[2rem] bg-white p-5">
      <h3 className="mb-3 font-serif text-2xl text-[#6f2b2f]">
        2. Forma de pago
      </h3>

      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full rounded-2xl border border-[#6f2b2f]/20 bg-white p-3 text-[#6f2b2f] outline-none"
      >
        <option value="">Selecciona una opción</option>
        <option value="Efectivo">Efectivo</option>
        <option value="Transferencia">Transferencia</option>
      </select>

      {paymentMethod === "Transferencia" && (
        <div className="mt-4 rounded-2xl border border-[#6f2b2f]/10 bg-[#fbf5ea] p-4 text-sm leading-6 text-[#2c2020]/70">
          <p className="font-semibold text-[#6f2b2f]">
            Manda aquí la transferencia:
          </p>
          <p>728969000150185324</p>
          <p>SPIN BY OXXO</p>
          <p>Alessandra Reséndiz Díaz</p>
          <p className="mt-2">
            Manda tu comprobante al número de WhatsApp donde se solicitó tu pedido.
          </p>
        </div>
      )}
    </div>

    <div className="rounded-[2rem] bg-white p-5">
      <h3 className="mb-3 font-serif text-2xl text-[#6f2b2f]">
        3. Tus datos
      </h3>

      <input
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        placeholder="Nombre completo"
        className="mb-3 w-full rounded-2xl border border-[#6f2b2f]/20 bg-white p-3 text-[#6f2b2f] outline-none placeholder:text-[#6f2b2f]/45"
      />

      <input
        value={customerPhone}
        onChange={(e) => setCustomerPhone(e.target.value)}
        placeholder="Número de WhatsApp"
        className="w-full rounded-2xl border border-[#6f2b2f]/20 bg-white p-3 text-[#6f2b2f] outline-none placeholder:text-[#6f2b2f]/45"
      />
    </div>
  </div>

  <div className="mt-6 mb-4 flex justify-between text-xl font-bold">
    <span>Total</span>
    <span>{money(total)}</span>
  </div>
<button
  onClick={sendOrder}
  disabled={
    !cart.length ||
    !deliveryPlace ||
    !paymentMethod ||
    !customerName ||
    !customerPhone ||
    (deliveryPlace === "Ninguno" && !shippingMethod)
  }
  className={`block w-full rounded-full px-6 py-4 text-center font-semibold text-white ${
    cart.length &&
    deliveryPlace &&
    paymentMethod &&
    customerName &&
    customerPhone &&
    (deliveryPlace !== "Ninguno" || shippingMethod)
      ? "bg-[#6f2b2f]"
      : "bg-[#6f2b2f]/30"
  }`}
>
  Enviar pedido por WhatsApp
</button>
</div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}