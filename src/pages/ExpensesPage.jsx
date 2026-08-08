import React from "react";
import { Card } from "../components/common/Card";
import { Link } from "react-router-dom";

export const ExpensesPage = () => {
  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-brand-gold font-bold text-sm">← Volver</Link>
        <h2 className="text-xl font-black text-brand-cream">Gestor de Gastos 💸</h2>
      </div>

      <Card className="bg-brand-card">
        <p className="text-xs text-brand-taupe">
          Administra aquí tus registros de gastos diarios para sincronizarlos con la regla 50/20/30.
        </p>
      </Card>
    </div>
  );
};
