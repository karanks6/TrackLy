export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute -inset-[100%] opacity-[0.15] blur-3xl mix-blend-screen"
        style={{
          background: `conic-gradient(from 90deg at 50% 50%, 
            var(--accent) 0%, 
            var(--surface-elevated) 30%, 
            var(--accent) 70%, 
            var(--background) 100%)`,
          animation: "spin 20s linear infinite",
        }}
      />
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
