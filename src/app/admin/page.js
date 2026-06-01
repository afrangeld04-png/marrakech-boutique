"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ClipboardList,
  ImageIcon,
  PlusCircle,
  Save,
  Upload,
} from "lucide-react";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "../lib/cloudinary";

export default function AdminPage() {
  const router = useRouter();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
    brand: "",
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);

const makeupBrands = [
  "Rare Beauty",
  "Fenty Beauty",
  "MAC Cosmetics",
  "Huda Beauty",
  "Anastasia Beverly Hills",
  "NARS",
  "Too Faced",
  "Urban Decay",
  "Charlotte Tilbury",
  "e.l.f. Cosmetics",
  "Maybelline New York",
  "L'Oréal Paris",
  "NYX Professional Makeup",
  "Revlon",
  "Bissú",
  "Pink Up",
  "Beauty Creations",
  "Rimmel London",
  "Morphe",
  "Benefit Cosmetics",
  "Clinique",
  "Estée Lauder",
  "Lancôme",
  "Dior Beauty",
  "Chanel Beauty",
  "Yves Saint Laurent Beauty",
  "Giorgio Armani Beauty",
  "Pat McGrath Labs",
  "Natasha Denona",
  "Saie",
  "Makeup by Mario",
  "Laura Mercier",
  "Hourglass",
  "Shiseido",
  "KIKO MILANO",
  "rhode",
  "Patrick Ta Beauté",
];
  const inputClass =
    "rounded-2xl bg-white border border-[#6f2b2f]/20 p-4 outline-none text-[#6f2b2f] placeholder:text-[#6f2b2f]/55 focus:border-[#6f2b2f]/60 focus:ring-2 focus:ring-[#6f2b2f]/10";

  const loadLowStockProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
const outOfStock = products.filter((item) => Number(item.stock) <= 0);

const lowStock = products.filter(
  (item) => Number(item.stock) > 0 && Number(item.stock) < 10
);

setOutOfStockProducts(outOfStock);
setLowStockProducts(lowStock);
  };

  useEffect(() => {
    const logged = localStorage.getItem("adminLogged");

    if (logged !== "true") {
      router.push("/admin/login");
      return;
    }

    loadLowStockProducts();
  }, [router]);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Error al subir imagen");
      }

      setProduct({
        ...product,
        image: data.secure_url,
      });

      alert("Imagen subida correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al subir imagen. Revisa el preset de Cloudinary.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.image) {
      alert("Sube una imagen antes de guardar el producto.");
      return;
    }

    setSaving(true);

    try {
      await addDoc(collection(db, "products"), {
        name: product.name,
        category: product.category,
        brand: product.category === "Maquillaje" ? product.brand : "",
        price: Number(product.price),
        stock: Number(product.stock),
        image: product.image,
        description: product.description,
        createdAt: serverTimestamp(),
      });

      alert("Producto guardado correctamente en Firestore.");

      setProduct({
        name: "",
        category: "",
        brand: "",
        price: "",
        stock: "",
        image: "",
        description: "",
      });

      await loadLowStockProducts();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el producto en Firestore.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf5ea] p-8">
      <div className="mb-6 flex justify-end gap-3">
        <button
          onClick={() => router.push("/")}
          className="rounded-full border border-[#6f2b2f] px-5 py-3 font-semibold text-[#6f2b2f] transition hover:bg-[#6f2b2f] hover:text-white"
        >
          Volver a la tienda
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("adminLogged");
            router.push("/admin/login");
          }}
          className="rounded-full bg-[#6f2b2f] px-5 py-3 font-semibold text-white transition hover:bg-[#5a2226]"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <span className="text-sm uppercase tracking-[0.35em] text-[#6f2b2f]/60">
            Dashboard
          </span>

          <h1 className="mt-3 font-serif text-6xl text-[#6f2b2f]">
            Admin Panel
          </h1>

          <p className="mt-4 text-[#2c2020]/70">
            Gestiona productos, precios, stock e imágenes.
          </p>
        </div>

        {(outOfStockProducts.length > 0 || lowStockProducts.length > 0) && (
  <div className="mb-8 space-y-5">
    {outOfStockProducts.length > 0 && (
      <div className="rounded-[2rem] border border-red-300 bg-red-50 p-6">
        <h3 className="mb-4 text-2xl font-bold text-red-700">
          🔴 Sin stock
        </h3>

        <div className="space-y-2">
          {outOfStockProducts.map((item) => (
            <div
              key={item.id}
              className="flex justify-between rounded-xl bg-white p-3"
            >
              <span className="font-medium text-[#2c2020]">
                {item.name}
              </span>

              <span className="font-bold text-red-600">
                Sin stock
              </span>
            </div>
          ))}
        </div>
      </div>
    )}

    {lowStockProducts.length > 0 && (
      <div className="rounded-[2rem] border border-yellow-300 bg-yellow-50 p-6">
        <h3 className="mb-4 text-2xl font-bold text-yellow-700">
          🟡 Stock bajo
        </h3>

        <div className="space-y-2">
          {lowStockProducts.map((item) => (
            <div
              key={item.id}
              className="flex justify-between rounded-xl bg-white p-3"
            >
              <span className="font-medium text-[#2c2020]">
                {item.name}
              </span>

              <span className="font-bold text-yellow-600">
                {item.stock} disponibles
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <Link
            href="/admin/productos"
            className="block rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <Package className="mb-4 text-[#6f2b2f]" />
            <h3 className="font-serif text-3xl text-[#6f2b2f]">Productos</h3>
            <p className="mt-2 text-[#2c2020]/60">Administrar catálogo.</p>
          </Link>

          <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5">
            <ClipboardList className="mb-4 text-[#6f2b2f]" />
            <h3 className="font-serif text-3xl text-[#6f2b2f]">Precios</h3>
            <p className="mt-2 text-[#2c2020]/60">Actualizar costos.</p>
          </div>

          <Link
  href="/admin/pedidos"
  className="block rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5 transition hover:-translate-y-1 hover:shadow-2xl"
>
  <ClipboardList className="mb-4 text-[#6f2b2f]" />

  <h3 className="font-serif text-3xl text-[#6f2b2f]">
    Pedidos
  </h3>

  <p className="mt-2 text-[#2c2020]/60">
    Ver pedidos recibidos.
  </p>
</Link>
        </div>

        <div className="rounded-[3rem] bg-white p-8 shadow-xl shadow-black/5">
          <div className="mb-8 flex items-center gap-3">
            <PlusCircle className="text-[#6f2b2f]" />
            <h2 className="font-serif text-4xl text-[#6f2b2f]">
              Nuevo producto
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Nombre del producto"
              className={inputClass}
              required
            />

            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="Joyería">Joyería</option>
              <option value="Maquillaje">Maquillaje</option>
              <option value="Accesorios para teléfono">
                Accesorios para teléfono
              </option>
              <option value="Ropa y bolsas">Ropa y bolsas</option>
              <option value="Accesorios">Accesorios</option>
            </select>
            {product.category === "Maquillaje" && (
  <select
    name="brand"
    value={product.brand}
    onChange={handleChange}
    className={inputClass}
  >
    <option value="">Selecciona una marca</option>

    {makeupBrands.map((brand) => (
      <option key={brand} value={brand}>
        {brand}
      </option>
    ))}
  </select>
)}

            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Precio"
              className={inputClass}
              required
            />

            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              placeholder="Stock disponible"
              className={inputClass}
              required
            />

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#6f2b2f]/25 bg-[#fbf5ea] p-8 text-center transition hover:border-[#6f2b2f]/50">
              <Upload className="mb-3 text-[#6f2b2f]" />
              <span className="font-semibold text-[#6f2b2f]">
                {uploading ? "Subiendo imagen..." : "Subir imagen del producto"}
              </span>
              <span className="mt-2 text-sm text-[#2c2020]/60">
                JPG, PNG o WEBP
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {product.image && (
              <div className="rounded-[2rem] border border-[#6f2b2f]/10 bg-[#fbf5ea] p-4">
                <p className="mb-3 text-sm font-semibold text-[#6f2b2f]">
                  Vista previa
                </p>
                <img
                  src={product.image}
                  alt="Vista previa"
                  className="h-72 w-full rounded-[1.5rem] object-cover"
                />
              </div>
            )}

            <input
              type="text"
              name="image"
              value={product.image}
              onChange={handleChange}
              placeholder="URL Imagen"
              className={inputClass}
            />

            <textarea
              rows="5"
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Descripción"
              className={inputClass}
              required
            />

            <button
              type="submit"
              disabled={saving || uploading}
              className="flex items-center justify-center gap-2 rounded-full bg-[#6f2b2f] px-6 py-4 font-semibold text-white transition hover:bg-[#5a2226] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />
              {saving ? "Guardando..." : "Guardar producto"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}