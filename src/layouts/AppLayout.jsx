import React from "react";
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
};