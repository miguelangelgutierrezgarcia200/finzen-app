import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Wallet, 
  Calculator, 
  GraduationCap, 
  Gamepad2, 
  User, 
  LogOut 
} from "lucide-react";

// Lista con todas las pestañas de navegación requeridas
const navItems = [
  { name: "Inicio", path: "/", icon: LayoutDashboard },
  { name: "Gestor de datos", path: "/expenses", icon: Wallet },
  { name: "Calculadora", path: "/calculators", icon: Calculator },
  { name: "Academia", path: "/academy", icon: GraduationCap },
  { name: "Juegos", path: "/game", icon: Gamepad2 },
  { name: "Perfil", path: "/profile", icon: User },
];

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#120C0A", color: "#F7E9DA" }}>
      {/* Sidebar / Barra lateral */}
      <aside style={{ width: "260px", background: "#1A120E", borderRight: "1px solid #251A14", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1.5rem" }}>
        <div>
          {/* Título de la App */}
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "2rem", color: "#F7E9DA" }}>
            FinZen
          </h2>

          {/* Menú de enlaces */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    textDecoration: "none",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    background: isActive ? "#251A14" : "transparent",
                    color: isActive ? "#F7E9DA" : "#A39382",
                    borderLeft: isActive ? "3px solid #E58D35" : "3px solid transparent",
                  })}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Usuario y Botón de Cerrar Sesión */}
        <div style={{ paddingTop: "1rem", borderTop: "1px solid #251A14" }}>
          <div style={{ fontSize: "0.85rem", color: "#A39382", marginBottom: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user?.email}
          </div>
          <button
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              width: "100%",
              padding: "0.75rem 1rem",
              background: "transparent",
              border: "none",
              borderRadius: "0.5rem",
              color: "#E55353",
              cursor: "pointer",
              fontWeight: "500",
              textAlign: "left"
            }}
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Área principal donde se renderizan las páginas */}
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}