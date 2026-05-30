"use client";

export default function ProductCard({ product }) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5 transition-all duration-300 hover:-translate-y-2">
      <img
        src={product.image}
        alt={product.name}
        className="h-80 w-full object-cover"
      />

      <div className="p-6">
        <span className="text-xs uppercase tracking-[0.25em] text-[#6f2b2f]/50">
          {product.category}
        </span>

        <h3 className="mt-2 font-serif text-2xl text-[#6f2b2f]">
          {product.name}
        </h3>

        <p className="mt-2 text-sm text-[#2c2020]/70">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-xl font-semibold text-[#6f2b2f]">
            ${product.price}
          </span>

          <button className="rounded-full bg-[#6f2b2f] px-5 py-2 text-sm font-medium text-white">
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
}