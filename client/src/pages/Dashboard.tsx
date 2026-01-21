import { Shell } from "@/components/layout/Shell";
import { BirthdayCard } from "@/components/BirthdayCard";
import { useBirthdays } from "@/lib/BirthdayContext";
import { isSameDay, setYear, isBefore, addYears, compareAsc, format, differenceInSeconds } from "date-fns";
import { Search, Filter, PartyPopper, BarChart3, TrendingUp, Calendar as CalendarIcon, Gift, Timer, PieChart, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RePie, Pie } from 'recharts';
import logoUrl from "@assets/Screenshot_20250206-193857_1768741360994.png";

export default function Dashboard() {
  const { birthdays, userProfile } = useBirthdays();
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const today = new Date();

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const greeting = useMemo(() => {
    const hour = today.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, [today]);

  const filtered = birthdays.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchesMonth = monthFilter === "all" || b.date.getMonth().toString() === monthFilter;
    return matchesSearch && matchesMonth;
  });

  const todaysBirthdays = filtered.filter(b => 
    isSameDay(setYear(b.date, today.getFullYear()), today)
  );

  const isMyBirthday = userProfile.birthday && isSameDay(setYear(new Date(userProfile.birthday), today.getFullYear()), today);

  const upcomingBirthdays = filtered
    .filter(b => !todaysBirthdays.includes(b))
    .map(b => {
      let nextDate = setYear(b.date, today.getFullYear());
      if (isBefore(nextDate, today)) nextDate = addYears(nextDate, 1);
      return { ...b, nextDate };
    })
    .sort((a, b) => compareAsc(a.nextDate, b.nextDate));

  const countdownTarget = upcomingBirthdays[0];
  const countdownText = useMemo(() => {
    if (!countdownTarget) return null;
    const diff = differenceInSeconds(countdownTarget.nextDate, currentTime);
    if (diff <= 0) return "00:00:00:00";
    const days = Math.floor(diff / (24 * 3600));
    const hours = Math.floor((diff % (24 * 3600)) / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    const secs = diff % 60;
    return `${days}d ${hours}h ${mins}m ${secs}s`;
  }, [countdownTarget, currentTime]);

  const stats = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthData = months.map((m, i) => ({
      name: m,
      count: birthdays.filter(b => b.date.getMonth() === i).length
    }));
    
    const relData = [
      { name: 'Family', value: birthdays.filter(b => b.relationship === 'Family').length, color: '#ec4899' },
      { name: 'Friend', value: birthdays.filter(b => b.relationship === 'Friend').length, color: '#8b5cf6' },
      { name: 'Work', value: birthdays.filter(b => b.relationship === 'Work').length, color: '#3b82f6' },
      { name: 'Other', value: birthdays.filter(b => b.relationship === 'Other').length, color: '#94a3b8' },
    ].filter(d => d.value > 0);

    const busiest = birthdays.length > 0 
      ? monthData.reduce((prev, current) => (prev.count > current.count) ? prev : current)
      : null;

    return { monthData, relData, busiest };
  }, [birthdays]);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-primary/20 to-accent/20 border border-primary/20 overflow-hidden shadow-lg animate-in fade-in slide-in-from-top-4 duration-1000 relative">
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="absolute h-[140%] w-[140%] max-w-none object-cover"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} 
              />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                {greeting}, {userProfile.name.split(' ')[0]}!
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-muted-foreground">
                  {birthdays.length === 0 ? "Start by adding your first reminder." : `You have ${upcomingBirthdays.length} upcoming birthdays.`}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-1.5 text-xs font-black text-primary hover:scale-105 transition-transform uppercase tracking-widest">
                      <BarChart3 className="h-3.5 w-3.5" /> Visual Insights
                    </button>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-none max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem]">
                      <DialogHeader>
                        <DialogTitle className="font-display text-3xl font-black">Birthday Analytics</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-8 py-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Busiest Month</p>
                            <p className="text-3xl font-black text-primary">{stats.busiest ? stats.busiest.name : "—"}</p>
                            <p className="text-xs text-muted-foreground mt-2">{stats.busiest ? `${stats.busiest.count} Celebrations` : "No data yet"}</p>
                          </div>
                          <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Reminders</p>
                            <p className="text-3xl font-black text-accent">{birthdays.length}</p>
                            <p className="text-xs text-muted-foreground mt-2">Active tracked contacts</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2 px-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Yearly Distribution</h3>
                          </div>
                          <div className="h-64 w-full bg-white/5 rounded-[2rem] p-4 border border-white/10">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={stats.monthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                                <YAxis hide />
                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1a1a1a', border: 'none', borderRadius: '12px', fontSize: '12px'}} />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                  {stats.monthData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === today.getMonth() ? '#ec4899' : '#8b5cf6'} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2 px-2">
                            <PieChart className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Relationship Split</h3>
                          </div>
                          <div className="h-64 w-full bg-white/5 rounded-[2rem] p-4 border border-white/10 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <RePie>
                                <Pie data={stats.relData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                  {stats.relData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{backgroundColor: '#1a1a1a', border: 'none', borderRadius: '12px', fontSize: '12px'}} />
                              </RePie>
                            </ResponsiveContainer>
                            <div className="flex flex-col gap-2">
                              {stats.relData.map((d, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full" style={{backgroundColor: d.color}} />
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{d.name} ({d.value})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 bg-white/50 backdrop-blur-sm border-border/50 focus:bg-white transition-all rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-[140px] bg-white/50 backdrop-blur-sm border-border/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Month" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map((m, i) => <SelectItem key={m} value={i.toString()}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {countdownTarget && (
          <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary/10 to-accent/10 p-8 border border-primary/20 group">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden border-2 border-primary/20">
                  {countdownTarget.image ? <img src={countdownTarget.image} className="h-full w-full object-cover" /> : <span className="text-3xl font-bold text-primary">{countdownTarget.name[0]}</span>}
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-display">Next Celebration</h2>
                  <p className="text-muted-foreground font-medium">{countdownTarget.name}'s Birthday</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-[1.5rem] p-6 border border-primary/20 shadow-xl min-w-[240px]">
                <div className="flex items-center gap-2 mb-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                  <Timer className="h-4 w-4 animate-pulse" /> Time to Celebrate
                </div>
                <div className="font-display text-3xl font-black tracking-tighter text-gradient">
                  {countdownText}
                </div>
              </div>
            </div>
          </div>
        )}

        {isMyBirthday && (
          <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary to-accent p-10 text-white shadow-2xl shadow-primary/30">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center animate-bounce">
                <PartyPopper className="h-12 w-12" />
              </div>
              <div>
                <h2 className="text-4xl font-black font-display tracking-tighter">Happy Birthday, {userProfile.name}!</h2>
                <p className="text-white/80 text-lg">Wishing you a spectacular year ahead filled with joy.</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Gift className="h-48 w-48" />
            </div>
          </div>
        )}

        {todaysBirthdays.length > 0 && (monthFilter === "all" || monthFilter === today.getMonth().toString()) && (
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-black tracking-tighter flex items-center gap-2">
              Today's Celebrations <PartyPopper className="h-6 w-6 text-primary" />
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {todaysBirthdays.map(b => <BirthdayCard key={b.id} birthday={b} />)}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-black tracking-tighter">
            {monthFilter === "all" ? "Upcoming List" : `Birthdays in ${months[parseInt(monthFilter)]}`}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingBirthdays.map(b => <BirthdayCard key={b.id} birthday={b} />)}
          </div>
          
          {upcomingBirthdays.length === 0 && todaysBirthdays.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-border p-16 text-center bg-muted/5">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Info className="h-8 w-8 text-muted-foreground opacity-30" />
              </div>
              <h3 className="font-bold text-lg">No birthdays found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new birthday to get started.</p>
            </div>
          )}
        </section>
      </div>
    </Shell>
  );
}
