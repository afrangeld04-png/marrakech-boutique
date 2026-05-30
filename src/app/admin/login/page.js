"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginAdmin() {
  const router = useRouter();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Cambia estos datos por los que quieran usar tus jefes
    if (
      user === "admin" &&
      password === "Marrakech2026"
    ) {
      localStorage.setItem("adminLogged", "true");
      router.push("/admin");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf5ea] px-6">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center font-serif text-4xl text-[#6f2b2f]">
  M. Atelier & Co.
</h1>

<p className="mb-6 text-center text-[#6f2b2f]/70">
  Acceso administrativo
</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
  type="text"
  placeholder="Usuario"
  value={user}
  onChange={(e) => setUser(e.target.value)}
  className="w-full rounded-xl border border-[#6f2b2f]/20 p-4 text-[#6f2b2f] placeholder:text-[#6f2b2f]/50 outline-none"
/>
        <input
  type="password"
  placeholder="Contraseña"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full rounded-xl border border-[#6f2b2f]/20 p-4 text-[#6f2b2f] placeholder:text-[#6f2b2f]/50 outline-none"
/>
          <button
            type="submit"
            className="w-full rounded-full bg-[#6f2b2f] py-4 font-semibold text-white"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </main>
  );
}