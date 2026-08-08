import React from "react";
import { Card } from "../components/common/Card";
import { Link } from "react-router-dom";

export const AcademyPage = () => {
  const courses = [
    {
      id: 1,
      title: "La Regla 50/20/30",
      desc: "Organiza tus ingresos en 50% necesidades básicas, 20% ahorro y 30% gastos personales.",
      level: "Básico",
    },
    {
      id: 2,
      title: "Fondo de Emergencia",
      desc: "Cómo construir un ahorro equivalente a 3-6 meses de gastos para imprevistos.",
      level: "Intermedio",
    },
    {
      id: 3,
      title: "Control de Gastos Hormiga",
      desc: "Estrategias para identificar y frenar los pequeños gastos diarios innecesarios.",
      level: "Básico",
    },
  ];

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-brand-gold font-bold text-sm">
          ← Volver
        </Link>
        <h2 className="text-xl font-black text-brand-cream">Academia FinZen 🎓</h2>
      </div>

      <p className="text-xs text-brand-taupe">
        Aprende los pilares fundamentales para mantener la salud financiera de tu aplicación.
      </p>

      <div className="grid gap-3">
        {courses.map((course) => (
          <Card key={course.id} className="bg-brand-card">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-bold text-brand-jade">{course.title}</h3>
              <span className="text-[10px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full font-semibold">
                {course.level}
              </span>
            </div>
            <p className="text-xs text-brand-taupe mt-1">{course.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};