import { Link, useLocation } from "wouter";
import { Home, Calendar, Plus, Gift, Settings, User as UserIcon, Sparkles, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddBirthdayDialog } from "@/components/AddBirthdayDialog";
import { Notifications } from "@/components/Notifications";
import { useState } from "react";
import { useBirthdays } from "@/lib/BirthdayContext";
import { AppLogo } from "@/components/AppLogo";

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { userProfile } = useBirthdays();

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: Sparkles, label: "Special Days", href: "/special" },
    { icon: NotebookPen, label: "Notes", href: "/notes" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-64 transition-colors duration-500">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl md:flex">
        <div className="flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 overflow-hidden relative shadow-inner backdrop-blur-sm">
              <AppLogo className="h-full w-full" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-gradient">RemindMe</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2 px-4 py-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                location === item.href 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </a>
            </Link>
          ))}
        </nav>

        {/* User Info Section */}
        <div className="p-4 mt-auto border-t border-border/50">
          <Link href="/settings">
            <a className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-all">
              <div className="h-10 w-10 rounded-full border border-border/50 overflow-hidden bg-primary/10 flex items-center justify-center">
                {userProfile.image ? (
                  <img src={userProfile.image} className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{userProfile.name}</p>
                <p className="text-[10px] text-muted-foreground">Premium Account</p>
              </div>
            </a>
          </Link>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="mt-4 w-full rounded-xl bg-linear-to-r from-primary to-purple-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-primary/25 active:scale-95"
          >
            + Add Birthday
          </button>
        </div>
      </aside>

      {/* Top Header for Mobile & Desktop (Notifications) */}
      <header className="fixed top-0 right-0 left-0 z-40 md:left-64 flex h-20 items-center justify-end px-6 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4">
          <Notifications />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl p-6 pt-24 md:p-10 md:pt-24 animate-in fade-in zoom-in-95 duration-500">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/80 px-6 pb-6 pt-4 backdrop-blur-xl md:hidden">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "flex flex-col items-center gap-1",
                location === item.href ? "text-primary" : "text-muted-foreground"
              )}>
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full transition-all",
                  location === item.href && "bg-primary/10"
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </a>
            </Link>
          ))}
          <button 
            onClick={() => setIsAddOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25 transition-transform active:scale-90"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <AddBirthdayDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}
