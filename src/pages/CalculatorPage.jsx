import React, { useState } from "react";
import { Card } from "../components/common/Card";
import { calculateCompoundInterest } from "../utils/math";
import { formatCOP } from "../utils/formatters";

export const CalculatorPage = () => {
  const [initial, setInitial] = useState(100000);
  const [monthly, setMonthly] = useState(50000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(5);

  const result = calculateCompoundInterest(
    Number(initial),
    Number(monthly),
    Number(rate),
    Number(years)
  );

  return (
    <div className="space-y-5 pb-24">
      <h2 className="text-xl font-black text-brand-gold">Simulador de Interés Compuesto</h2>
      
      <Card className="space-y-4">
        <div>
          <label className="text-xs font-bold text-brand-taupe block mb-1">Monto Inicial ($)</label>
          <input
            type="number"
            value={initial}
            onChange={(e) => setInitial(e.target.value)}
            className="w-full bg-brand-card border border-brand-taupe/30 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-brand-taupe block mb-1">Aporte Mensual ($)</label>
          <input
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            className="w-full bg-brand-card border border-brand-taupe/30 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-brand-taupe block mb-1">Tasa Anual (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full bg-brand-card border border-brand-taupe/30 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-brand-taupe block mb-1">Años</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full bg-brand-card border border-brand-taupe/30 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-brand-card2 to-brand-jade/10 border-brand-jade/40 text-center py-6">
        <p className="text-xs text-brand-taupe font-bold uppercase">Proyección Final Estimada</p>
        <p className="text-3xl font-black text-brand-jade mt-2">{formatCOP(result.finalBalance)}</p>
      </Card>
    </div>
  );
};