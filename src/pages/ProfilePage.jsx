import React from "react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/common/Card";

export const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-4 pb-24">
      <h2 className="text-xl font-black text-brand-cream">Mi Perfil 👤</h2>

      <Card className="bg-brand-card space-y-3">
        <div>
          <p className="text-[10px] text-brand-taupe uppercase font-bold">Nombre</p>
          <p className="text-sm font-bold text-brand-cream">{user?.name || "Usuario"}</p>
        </div>
        <div>
          <p className="text-[10px] text-brand-taupe uppercase font-bold">Correo Electrónico</p>
          <p className="text-sm font-bold text-brand-cream">{user?.email || "Sin correo"}</p>
        </div>
      </Card>

      <button
        onClick={logout}
        className="w-full py-3 bg-brand-red/20 text-brand-red font-bold rounded-2xl border border-brand-red/30 hover:bg-brand-red/30 transition-colors text-sm"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};