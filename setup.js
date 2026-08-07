const fs = require('fs');
const path = require('path');

const projectStructure = {
  'package.json': JSON.stringify({
    "name": "finzen-app",
    "private": true,
    "version": "2.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
      "preview": "vite preview"
    },
    "dependencies": {
      "@heroicons/react": "^2.1.1",
      "chart.js": "^4.4.1",
      "clsx": "^2.1.0",
      "firebase": "^10.8.0",
      "framer-motion": "^11.0.3",
      "lucide-react": "^0.323.0",
      "react": "^19.0.0",
      "react-chartjs-2": "^5.2.0",
      "react-dom": "^19.0.0",
      "react-hook-form": "^7.50.1",
      "react-hot-toast": "^2.4.1",
      "react-router-dom": "^6.22.0",
      "tailwind-merge": "^2.2.1"
    },
    "devDependencies": {
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      "@vitejs/plugin-react": "^4.2.1",
      "autoprefixer": "^10.4.17",
      "eslint": "^8.56.0",
      "eslint-plugin-react": "^7.33.2",
      "eslint-plugin-react-hooks": "^4.6.0",
      "postcss": "^8.4.35",
      "tailwindcss": "^3.4.1",
      "vite": "^5.1.0"
    }
  }, null, 2),

  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#1B120D',
          card: '#251A14',
          card2: '#33221A',
          jade: '#2D9E6B',
          gold: '#F4B942',
          wine: '#9C4F6E',
          red: '#C23616',
          cream: '#F7E9DA',
          taupe: '#B08D74',
          ink: '#2A160D',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}`,

  'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  'index.html': `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FinZen</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,

  'src/styles/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-brand-bg text-brand-cream font-sans antialiased selection:bg-brand-jade selection:text-brand-ink;
  }
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #33221A;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #B08D74;
}`,

  'src/firebase/config.js': `import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForDevelopment123456",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "finzen-f4ab3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "finzen-f4ab3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "finzen-f4ab3.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();`,

  'src/utils/formatters.js': `export const formatCOP = (amount) => {
  if (isNaN(amount) || amount === null) return "$0";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-CO', options);
};`,

  'src/utils/math.js': `export const calculateCompoundInterest = (principal, monthlyContribution, rateAnnual, years) => {
  const r = rateAnnual / 100 / 12;
  const n = years * 12;
  let total = principal;
  const breakdown = [];

  for (let i = 1; i <= n; i++) {
    total = total * (1 + r) + monthlyContribution;
    if (i % 12 === 0) {
      breakdown.push({
        year: i / 12,
        balance: Math.round(total),
        contributions: Math.round(principal + monthlyContribution * i),
        interest: Math.round(total - (principal + monthlyContribution * i))
      });
    }
  }

  return { finalBalance: Math.round(total), breakdown };
};`,

  'src/context/AuthContext.jsx': `import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase/config";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUserProfile = async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUser = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        email: firebaseUser.email,
        createdAt: new Date().toISOString(),
        settings: { darkMode: true }
      };
      await setDoc(userRef, newUser);
      setUser(newUser);
    } else {
      setUser(userSnap.data());
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      syncUserProfile(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const register = async (email, password, name) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "users", res.user.uid);
    const newUser = {
      uid: res.user.uid,
      name,
      email,
      createdAt: new Date().toISOString()
    };
    await setDoc(userRef, newUser);
    setUser(newUser);
  };

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};`,

  'src/components/common/Card.jsx': `import React from "react";
import { motion } from "framer-motion";

export const Card = ({ children, className = "", onClick, hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={\`bg-brand-card2 border border-brand-taupe/20 rounded-2xl p-5 shadow-lg backdrop-blur-md \${onClick ? 'cursor-pointer' : ''} \${className}\`}
    >
      {children}
    </motion.div>
  );
};`,

  'src/components/common/Navbar.jsx': `import React from "react";
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
              \`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 \${
                isActive ? "text-brand-jade scale-105" : "text-brand-taupe hover:text-brand-cream"
              }\`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};`,

  'src/components/dashboard/FinanceCharts.jsx': `import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

export const BudgetDoughnut = ({ needs, savings, wants }) => {
  const data = {
    labels: ["Necesidades (50%)", "Ahorro (20%)", "Gastos/Gustos (30%)"],
    datasets: [
      {
        data: [needs, savings, wants],
        backgroundColor: ["#F4B942", "#2D9E6B", "#C23616"],
        borderColor: "#251A14",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#F7E9DA", font: { family: "Nunito", size: 12 } },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-48 w-full">
      <Doughnut data={data} options={options} />
    </div>
  );
};`,

  'src/pages/AuthPage.jsx': `import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login, register, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        if (!name.trim()) return toast.error("Ingresa tu nombre");
        await register(email, password, name);
        toast.success("Cuenta creada exitosamente");
      } else {
        await login(email, password);
        toast.success("Sesión iniciada");
      }
    } catch (err) {
      toast.error(err.message || "Error al autenticar");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-tr from-brand-jade to-brand-gold rounded-2xl mx-auto flex items-center justify-center text-3xl font-black text-brand-ink mb-3 shadow-lg shadow-brand-jade/20">
          F
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-brand-jade to-brand-gold bg-clip-text text-transparent">
          FinZen
        </h1>
        <p className="text-xs text-brand-taupe mt-1">Tu academia y gestor financiero integral</p>
      </div>

      <div className="bg-brand-card2 border border-brand-taupe/20 p-6 rounded-3xl shadow-xl">
        <div className="flex bg-brand-card p-1 rounded-xl mb-6">
          <button
            onClick={() => setIsRegister(false)}
            className={\`flex-1 py-2 text-xs font-bold rounded-lg transition-all \${!isRegister ? "bg-brand-jade text-brand-ink" : "text-brand-taupe"}\`}
          >
            Ingresar
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={\`flex-1 py-2 text-xs font-bold rounded-lg transition-all \${isRegister ? "bg-brand-jade text-brand-ink" : "text-brand-taupe"}\`}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-bold text-brand-taupe block mb-1">Nombre Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-brand-card border border-brand-taupe/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-jade"
                placeholder="Miguel Gutiérrez"
              />
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-brand-taupe block mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-card border border-brand-taupe/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-jade"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-brand-taupe block mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-card border border-brand-taupe/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-jade"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-brand-jade to-brand-gold text-brand-ink font-extrabold py-3.5 rounded-xl text-sm shadow-md hover:opacity-95 transition-opacity"
          >
            {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-taupe/20"></div></div>
          <div className="relative flex justify-center text-xs"><span className="bg-brand-card2 px-2 text-brand-taupe">O continúa con</span></div>
        </div>

        <button
          onClick={() => loginWithGoogle().catch(e => toast.error(e.message))}
          className="w-full bg-brand-card border border-brand-taupe/30 text-brand-cream font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-brand-taupe/10 transition-colors"
        >
          Google
        </button>
      </div>
    </div>
  );
};`,

  'src/pages/DashboardPage.jsx': `import React from "react";
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
};`,

  'src/pages/CalculatorPage.jsx': `import React, { useState } from "react";
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
};`,

  'src/layouts/AppLayout.jsx': `import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-cream max-w-md mx-auto relative flex flex-col">
      <header className="sticky top-0 z-40 bg-brand-card/80 backdrop-blur-md px-5 py-4 border-b border-brand-taupe/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-brand-jade to-brand-gold rounded-xl flex items-center justify-center font-black text-brand-ink text-sm">
            F
          </div>
          <span className="font-black text-lg bg-gradient-to-r from-brand-jade to-brand-gold bg-clip-text text-transparent">
            FinZen
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4">
        <Outlet />
      </main>

      <Navbar />
    </div>
  );
};`,

  'src/App.jsx': `import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import { AuthPage } from "./pages/AuthPage";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { CalculatorPage } from "./pages/CalculatorPage";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" toastOptions={{ style: { background: '#251A14', color: '#F7E9DA' } }} />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="calculators" element={<CalculatorPage />} />
            <Route path="expenses" element={<DashboardPage />} />
            <Route path="academy" element={<DashboardPage />} />
            <Route path="game" element={<DashboardPage />} />
            <Route path="profile" element={<DashboardPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}`,

  'src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
};

Object.entries(projectStructure).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content);
});

console.log('¡Estructura completa de FinZen generada con éxito!');