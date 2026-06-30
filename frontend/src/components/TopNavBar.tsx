import Image from "next/image";

export default function TopNavBar() {
  return (
    <header className="flex justify-between items-center w-full px-8 py-2 sticky top-0 z-40 bg-background border-b border-border h-16">
      <div className="flex items-center gap-4 md:hidden">
        <span className="material-symbols-outlined text-primary cursor-pointer hover:text-on-surface transition-colors">menu</span>
        <span className="text-xl font-bold text-on-surface">Schedulyx</span>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center bg-surface border border-border rounded-lg px-3 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <span className="material-symbols-outlined text-text-muted text-sm mr-2">search</span>
        <input 
          type="text" 
          placeholder="Buscar..." 
          className="bg-transparent border-none focus:ring-0 text-sm text-on-surface placeholder:text-text-muted w-64 outline-none" 
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-text-muted hover:text-on-surface transition-colors">notifications</button>
        <div className="w-8 h-8 rounded-full bg-surface border border-border overflow-hidden relative">
          <Image 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuALh-8-EbIMb3gPdFEj5zgxzxhbCxI9CDzUy1kjQU4ONHbdv7sjd760hrDBQkXMwlMN1AS9sN_AZIUbkeetX1vbZG8V6q-Tk8Y8cYrwuzpF7rkJBK-9ur1RqednuKIgGnjuIph-yrEz14DEpz4BMHfN96m_sHCbnTvRjvvTxoafYiZM6QBwd-cYoddObICQU5Pu0moBuNZ1f8j5CS6aXUZzwye2gEZdURNhZVjiBlqHdox1dOiFdAQKAN1sR5Ld03XLyZV49DRud0A" 
            alt="User Avatar" 
            fill 
            className="object-cover" 
          />
        </div>
        <button className="hidden md:flex btn-primary px-4 py-1.5 text-sm font-medium items-center gap-2 hover:bg-inverse-primary transition-colors">
          <span className="material-symbols-outlined text-sm">add</span>
          Novo Agendamento
        </button>
      </div>
    </header>
  );
}
