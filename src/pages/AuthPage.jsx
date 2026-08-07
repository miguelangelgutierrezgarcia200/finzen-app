import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

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
      navigate("/"); // Redirige al Dashboard
    } catch (err) {
      toast.error(err.message || "Error al autenticar");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/"); // Redirige al Dashboard
    } catch (e) {
      toast.error(e.message);
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
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isRegister ? "bg-brand-jade text-brand-ink" : "text-brand-taupe"}`}
          >
            Ingresar
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isRegister ? "bg-brand-jade text-brand-ink" : "text-brand-taupe"}`}
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
                placeholder="Nombre completo"
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
          onClick={handleGoogleLogin}
          className="w-full bg-brand-card border border-brand-taupe/30 text-brand-cream font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-brand-taupe/10 transition-colors"
        >
          Google
        </button>
      </div>
    </div>
  );
};