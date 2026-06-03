import { useEffect, useState } from "react";

export default function PageLoader({ message = "Chargement en cours…" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-4
        backdrop-blur-md bg-white/40 transition-opacity duration-300
        ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="relative w-14 h-14 flex items-center justify-center">
        <span className="absolute inset-1.5 rounded-full border-2 border-violet-400/30 animate-pulse" />
        <span className="w-11 h-11 rounded-full border-[3px] border-violet-200 border-t-violet-600 animate-spin block" />
      </div>
      <p className="text-sm font-medium tracking-wide text-violet-800">{message}</p>
      <p className="text-xs text-violet-500/60 -mt-2">Veuillez patienter</p>
    </div>
  );
}