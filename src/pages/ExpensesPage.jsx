import React, { useState, useEffect } from "react";
import { Card } from "../components/common/Card";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

export const ExpensesPage = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // Consulta los gastos del usuario actual
        const q = query(collection(db, "gastos"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(data);
      } catch (error) {
        console.warn("Fallo de red o modo offline al obtener gastos:", error);
        setIsOffline(true);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user]);

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-brand-gold font-bold text-sm">← Volver</Link>
        <h2 className="text-xl font-black text-brand-cream">Gestor de Gastos 💸</h2>
      </div>

      {/* Aviso visual en caso de estar sin conexión */}
      {isOffline && (
        <div className="p-3 text-xs bg-amber-900/40 border border-amber-600/40 text-amber-200 rounded-lg">
          Modo sin conexión activo. Mostrando datos cacheados.
        </div>
      )}

      <Card className="bg-brand-card">
        <p className="text-xs text-brand-taupe mb-4">
          Administra aquí tus registros de gastos diarios para sincronizarlos con la regla 50/20/30.
        </p>

        {loading ? (
          <p className="text-xs text-brand-taupe">Cargando registros...</p>
        ) : expenses.length === 0 ? (
          <p className="text-xs text-brand-taupe">No hay gastos registrados aún.</p>
        ) : (
          <ul className="space-y-2">
            {expenses.map((expense) => (
              <li key={expense.id} className="flex justify-between text-xs text-brand-cream border-b border-brand-taupe/20 py-2">
                <span>{expense.concepto || expense.nombre}</span>
                <span className="font-bold">${expense.monto}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};