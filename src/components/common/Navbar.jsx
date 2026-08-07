import React from "react";
import { NavLink } from "react-router-dom";
import { 
  HomeIcon, 
  AcademicCapIcon, 
  BanknotesIcon, 
  PuzzlePieceIcon, 
  CalculatorIcon,
  UserIcon 
} from "@heroicons/react/24/outline";

export const Navbar = () => {
  const navItems = [
    { to: "/", icon: HomeIcon, label: "Inicio" },
    { to: "/academy", icon: AcademicCapIcon, label: "Academia" },
    { to: "/expenses", icon: BanknotesIcon, label: "Gastos" },
    { to: "/game", icon: PuzzlePieceIcon, label: "Juego" },
    { to: "/calculators", icon: CalculatorIcon, label: "Calcular" },
    { to: "/profile", icon: UserIcon, label: "Perfil" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-brand-card/95 border-t border-brand-taupe/20 px-4 py-2 backdrop-blur-lg z-50">
      <div className="flex justify-between items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                isActive ? "text-brand-jade scale-105" : "text-brand-taupe hover:text-brand-cream"
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};