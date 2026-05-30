"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const snapshot = await getDocs(collection(db, "products"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(data);
      } catch (error) {
        console.error(error);
        setErrorText(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <section id="coleccion" className="bg-[#fbf5ea] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14">
          <span className="text-sm uppercase tracking-[0.35em] text-[#6f2b2f]/60">
            Disponibles
          </span>

          <h2 className="mt-4 font-serif text-5xl text-[#6f2b2f]">
            Último drop
          </h2>
        </div>

        {loading && <p className="text-[#6f2b2f]">Cargando productos...</p>}

        {errorText && (
          <div className="rounded-2xl bg-red-100 p-5 text-red-700">
            Error al cargar productos: {errorText}
          </div>
        )}

        {!loading && !errorText && products.length === 0 && (
          <p className="text-[#6f2b2f]">Aún no hay productos registrados.</p>
        )}

        {!loading && !errorText && products.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}