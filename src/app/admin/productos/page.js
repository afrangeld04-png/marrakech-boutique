"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Edit3, Save, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const categories = [
  "Joyería",
  "Maquillaje",
  "Accesorios para teléfono",
  "Ropa y bolsas",
  "Accesorios",
];
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
const accessoryTypes = [
  "Termos",
  "Bath&Body Works",
  "Lentes",
  "Charm bar",
];
function getStockStatus(stock) {
  const value = Number(stock);

  if (value <= 0) {
    return {
      text: "Sin stock",
      className: "bg-red-100 text-red-700",
    };
  }

  if (value < 10) {
    return {
      text: "Stock bajo",
      className: "bg-yellow-100 text-yellow-700",
    };
  }

  return {
    text: "Disponible",
    className: "bg-green-100 text-green-700",
  };
}
export default function AdminProductsPage() {
  const router = useRouter();

useEffect(() => {
  const logged = localStorage.getItem("adminLogged");

  if (logged !== "true") {
    router.push("/admin/login");
  }
}, []);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editProduct, setEditProduct] = useState({});

  const loadProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditProduct(product);
  };

  const handleChange = (e) => {
    setEditProduct({
      ...editProduct,
      [e.target.name]: e.target.value,
    });
  };

  const saveChanges = async (id) => {
    await updateDoc(doc(db, "products", id), {
      name: editProduct.name,
      category: editProduct.category,
       brand: editProduct.category === "Maquillaje" ? editProduct.brand || "" : "",
       accessoryType:
  editProduct.category === "Accesorios"
    ? editProduct.accessoryType || ""
    : "",
      price: Number(editProduct.price),
      stock: Number(editProduct.stock),
      description: editProduct.description,
    });

    setEditingId(null);
    setEditProduct({});
    await loadProducts();

    alert("Producto actualizado correctamente");
  };

  const deleteProduct = async (id) => {
    const confirmDelete = confirm("¿Seguro que quieres eliminar este producto?");

    if (!confirmDelete) return;

    await deleteDoc(doc(db, "products", id));
    await loadProducts();

    alert("Producto eliminado correctamente");
  };

  const groupedProducts = categories.map((category) => ({
    category,
    products: products.filter((product) => product.category === category),
  }));

  return (
    <main className="min-h-screen bg-[#fbf5ea] p-8">
      <div className="flex justify-end mb-6">
  <button
    onClick={() => {
      localStorage.removeItem("adminLogged");
      router.push("/admin/login");
    }}
    className="rounded-full bg-[#6f2b2f] px-5 py-3 text-white font-semibold hover:bg-[#5a2226]"
  >
    Cerrar sesión
  </button>
</div>
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
    className="inline-flex items-center gap-2 rounded-full border border-[#6f2b2f] px-5 py-3 font-semibold text-[#6f2b2f] transition hover:bg-[#6f2b2f] hover:text-white"
  >
    Volver a la tienda
  </Link>
</div>

        <h1 className="font-serif text-6xl text-[#6f2b2f]">
          Productos
        </h1>

        <p className="mt-3 text-[#2c2020]/70">
          Edita, elimina y organiza los productos por categoría.
        </p>

        <div className="mt-10 space-y-12">
          {groupedProducts.map((group) => (
            <section key={group.category}>
              <h2 className="mb-5 font-serif text-4xl text-[#6f2b2f]">
                {group.category}
              </h2>

              {group.products.length === 0 ? (
                <p className="rounded-2xl bg-white p-5 text-[#2c2020]/60">
                  No hay productos en esta categoría.
                </p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {group.products.map((product) => (
                    <div
                      key={product.id}
                      className="grid gap-5 rounded-[2rem] bg-white p-5 shadow-xl shadow-black/5 md:grid-cols-[180px_1fr]"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-52 w-full rounded-[1.5rem] object-cover"
                      />

                      <div>
                        {editingId === product.id ? (
                          <div className="grid gap-3">
                            <input
                              name="name"
                              value={editProduct.name}
                              onChange={handleChange}
                              className="rounded-xl border p-3 text-[#6f2b2f]"
                            />

                            <select
                              name="category"
                              value={editProduct.category}
                              onChange={handleChange}
                              className="rounded-xl border p-3 text-[#6f2b2f]"
                            >
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                            {editProduct.category === "Maquillaje" && (
  <select
    name="brand"
    value={editProduct.brand || ""}
    onChange={handleChange}
    className="rounded-xl border p-3 text-[#6f2b2f]"
  >
    <option value="">Selecciona una marca</option>

    {makeupBrands.map((brand) => (
      <option key={brand} value={brand}>
        {brand}
      </option>
    ))}
  </select>
  
)}
{editProduct.category === "Accesorios" && (
  <select
    name="accessoryType"
    value={editProduct.accessoryType || ""}
    onChange={handleChange}
    className="rounded-xl border p-3 text-[#6f2b2f]"
  >
    <option value="">Selecciona un tipo de accesorio</option>

    {accessoryTypes.map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>
)}

                            <input
                              type="number"
                              name="price"
                              value={editProduct.price}
                              onChange={handleChange}
                              className="rounded-xl border p-3 text-[#6f2b2f]"
                            />

                            <input
                              type="number"
                              name="stock"
                              value={editProduct.stock}
                              onChange={handleChange}
                              className="rounded-xl border p-3 text-[#6f2b2f]"
                            />

                            <textarea
                              name="description"
                              value={editProduct.description}
                              onChange={handleChange}
                              className="rounded-xl border p-3 text-[#6f2b2f]"
                            />

                            <button
                              onClick={() => saveChanges(product.id)}
                              className="flex items-center justify-center gap-2 rounded-full bg-[#6f2b2f] px-5 py-3 font-semibold text-white"
                            >
                              <Save size={18} />
                              Guardar cambios
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm uppercase tracking-[0.25em] text-[#6f2b2f]/50">
                              {product.category}
                            </p>

                            <h3 className="mt-1 font-serif text-3xl text-[#6f2b2f]">
                              {product.name}
                            </h3>

                            <p className="mt-2 text-[#2c2020]/65">
                              {product.description}
                            </p>

                            <p className="mt-4 font-bold text-[#2c2020]">
                              ${product.price}
                            </p>

                           
                           <div className="mt-3 flex flex-wrap items-center gap-2">
                            <p className="text-sm text-[#2c2020]/50">
                             Stock: {product.stock}
                              </p>


                              <span
                               className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                getStockStatus(product.stock).className
                              }`}
                           >
                             {getStockStatus(product.stock).text}
                             </span>
                             <div className="mt-5 flex flex-wrap gap-3">

                                <button
                                onClick={() => startEdit(product)}
                                className="flex items-center gap-2 rounded-full bg-[#fbf5ea] px-5 py-3 font-semibold text-[#6f2b2f]"
                                >
                                  <Edit3 size={17} />
                                  Editar
                                </button>
                                
                                 <button
                                 onClick={() => deleteProduct(product.id)}
                                 className="flex items-center gap-2 rounded-full bg-red-100 px-5 py-3 font-semibold text-red-700" 
                                >
                                  <Trash2 size={17} />
                                  Eliminar
                                </button>
                              </div>
                              
                            </div>

                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}