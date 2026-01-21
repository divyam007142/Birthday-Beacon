import { Shell } from "@/components/layout/Shell";
import { DayPicker } from "react-day-picker";
import { useBirthdays } from "@/lib/BirthdayContext";
import { useState, useMemo } from "react";
import { BirthdayCard } from "@/components/BirthdayCard";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import "react-day-picker/style.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Info, ListFilter, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CalendarView() {
  const { birthdays } = useBirthdays();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [month, setMonth] = useState<Date>(new Date());
  const today = new Date();

  const selectedBirthdays = date ? birthdays.filter(b => 
    isSameDay(new Date(today.getFullYear(), b.date.getMonth(), b.date.getDate()), date)
  ) : [];

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      const dayBirthdays = birthdays.filter(b => 
        isSameDay(new Date(today.getFullYear(), b.date.getMonth(), b.date.getDate()), newDate)
      );
      if (dayBirthdays.length > 0) {
        setIsDialogOpen(true);
      }
    }
  };

  const currentMonthBirthdays = useMemo(() => {
    return birthdays.filter(b => b.date.getMonth() === month.getMonth())
      .sort((a, b) => a.date.getDate() - b.date.getDate());
  }, [birthdays, month]);

  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">Calendar</h1>
            <p className="text-muted-foreground">Keep track of every celebration in one view.</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <CalendarIcon className="h-7 w-7" />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Calendar Section - Main Card */}
          <div className="lg:col-span-8 group">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-card/40 p-8 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:shadow-primary/5">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
              
              <style>
                {`
                  .has-birthday-dot {
                    position: relative;
                  }
                  .has-birthday-dot::after {
                    content: '';
                    position: absolute;
                    bottom: 6px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 6px;
                    height: 6px;
                    background-color: var(--primary);
                    border-radius: 50%;
                    box-shadow: 0 0 12px var(--primary);
                  }
                  .rdp {
                    --rdp-cell-size: 54px;
                    --rdp-accent-color: var(--primary);
                    --rdp-background-color: var(--primary);
                    margin: 0 auto;
                  }
                  .rdp-day_selected {
                     background-color: var(--primary) !important;
                     color: white !important;
                     border-radius: 16px !important;
                     box-shadow: 0 10px 20px -5px var(--primary);
                     transform: scale(1.05);
                  }
                  .rdp-day:hover {
                     background-color: var(--primary/10) !important;
                     border-radius: 16px !important;
                  }
                  .rdp-head_cell {
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: var(--muted-foreground);
                    letter-spacing: 0.05em;
                  }
                  .rdp-month {
                    width: 100%;
                  }
                  @media (max-width: 640px) {
                    .rdp {
                      --rdp-cell-size: 44px;
                    }
                  }
                `}
              </style>
              
              <DayPicker
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                month={month}
                onMonthChange={setMonth}
                modifiers={{
                  hasBirthday: (date) => birthdays.some(b => 
                    b.date.getDate() === date.getDate() && 
                    b.date.getMonth() === date.getMonth()
                  )
                }}
                modifiersClassNames={{
                  hasBirthday: "has-birthday-dot font-black text-primary"
                }}
                className={cn("p-0 text-foreground")}
                classNames={{
                  today: "text-accent font-black border-b-2 border-accent",
                  chevron: "fill-primary"
                }}
              />

              <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-t border-white/10 pt-6">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                  <span>Birthday</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                  <span>Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Sidebar - Detailed View */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-display text-xl font-bold flex items-center gap-2 text-foreground">
                <ListFilter className="h-5 w-5 text-primary" /> 
                Events
              </h2>
              <Badge variant="secondary" className="rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-tighter bg-primary/10 text-primary border-none">
                {currentMonthBirthdays.length} in {format(month, "MMM")}
              </Badge>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {currentMonthBirthdays.length > 0 ? (
                currentMonthBirthdays.map(b => (
                  <BirthdayCard key={b.id} birthday={b} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 p-12 text-center bg-card/20 backdrop-blur-sm">
                  <div className="h-16 w-16 rounded-3xl bg-muted/50 flex items-center justify-center mb-6 text-muted-foreground rotate-12 transition-transform hover:rotate-0">
                    <CalendarIcon className="h-8 w-8 opacity-50" />
                  </div>
                  <h3 className="font-bold text-muted-foreground">Quiet Month</h3>
                  <p className="text-sm text-muted-foreground/60 mt-2">No celebrations scheduled for this month yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Help Footer */}
        <div className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-linear-to-r from-primary/5 to-transparent border border-white/5">
           <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
             <Info className="h-5 w-5" />
           </div>
           <p className="text-xs font-medium text-muted-foreground">
             Pro tip: Birthdays are highlighted with a glowing indicator. Click any date to view celebratees instantly.
           </p>
        </div>

        {/* Selected Date Popup */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="glass-card border-none sm:max-w-md rounded-[2.5rem] shadow-2xl p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="font-display text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                {date ? format(date, "MMMM d") : ""}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedBirthdays.map(b => (
                <BirthdayCard key={b.id} birthday={b} />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Shell>
  );
}
