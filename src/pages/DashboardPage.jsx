import React from "react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/common/Card";
import { BudgetDoughnut } from "../components/dashboard/FinanceCharts";
import { formatCOP } from "../utils/formatters";
import { Link } from "react-router-dom";

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-5 pb-24">
      <div className="bg-gradient-to-br from-brand-wine to-brand-gold p-6 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <span className="text-xs text-white/80 font-bold uppercase tracking-wider">Panel Principal</span>
          <h2 className="text-2xl font-black text-white mt-1">¡Hola, {user?.name?.split(" ")[0]}! 👋</h2>
          <p className="text-xs text-white/90 mt-2 max-w-[240px]">
            Revisa tu presupuesto sugerido según la regla 50/20/30 hoy.
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 text-8xl opacity-15 select-none">💰</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="border-l-4 border-l-brand-jade">
          <p className="text-[11px] text-brand-taupe font-bold">Ingresos Reales</p>
          <p className="text-lg font-black text-brand-jade mt-1">{formatCOP(1200000)}</p>
        </Card>
        <Card className="border-l-4 border-l-brand-red">
          <p className="text-[11px] text-brand-taupe font-bold">Gastos Totales</p>
          <p className="text-lg font-black text-brand-red mt-1">{formatCOP(450000)}</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-bold text-brand-cream mb-4">Presupuesto Sugerido (50/20/30)</h3>
        <BudgetDoughnut needs={600000} savings={240000} wants={360000} />
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-brand-cream">Módulos de Aprendizaje</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/academy">
            <Card className="bg-brand-card hover:border-brand-jade transition-colors">
              <span className="text-2xl">🎓</span>
              <p className="text-xs font-bold text-brand-jade mt-2">Academia</p>
              <p className="text-[10px] text-brand-taupe mt-0.5">3 Cursos Libres</p>
            </Card>
          </Link>
          <Link to="/expenses">
            <Card className="bg-brand-card hover:border-brand-gold transition-colors">
              <span className="text-2xl">💸</span>
              <p className="text-xs font-bold text-brand-gold mt-2">Gestor de Gastos</p>
              <p className="text-[10px] text-brand-taupe mt-0.5">Control 50/20/30</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};