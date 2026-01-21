import logoUrl from "@assets/1000079388-removebg-preview_1768902232140.png";

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden flex items-center justify-center rounded-full bg-transparent ${className}`}>
      <img 
        src={logoUrl} 
        alt="Logo" 
        className="w-full h-full object-contain scale-[1.1] transform-gpu"
        style={{ 
          filter: "drop-shadow(0 0 8px rgba(0,0,0,0.1))",
          imageRendering: "auto"
        }}
      />
    </div>
  );
}
