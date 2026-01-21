import { Bell, BellOff, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useBirthdays } from "@/lib/BirthdayContext";
import { setYear, differenceInDays, isBefore, addYears } from "date-fns";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

export function Notifications() {
  const { birthdays } = useBirthdays();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }

    const today = new Date();
    const matches: any[] = [];

    birthdays.forEach(b => {
      let nextDate = setYear(b.date, today.getFullYear());
      if (isBefore(nextDate, today)) {
        nextDate = addYears(nextDate, 1);
      }
      const days = differenceInDays(nextDate, today);
      
      const prefs = b.reminders || { oneDay: true, twoDays: false, sevenDays: false };
      
      let notification = null;
      if (days === 0) notification = { ...b, daysUntil: 0, type: 'Today' };
      else if (days === 1 && prefs.oneDay) notification = { ...b, daysUntil: 1, type: 'Tomorrow' };
      else if (days === 2 && prefs.twoDays) notification = { ...b, daysUntil: 2, type: 'In 2 days' };
      else if (days === 7 && prefs.sevenDays) notification = { ...b, daysUntil: 7, type: 'In 7 days' };

      if (notification) {
        matches.push(notification);
        
        // Push notification simulation
        const lastNotified = localStorage.getItem(`notified_${b.id}_${notification.type}`);
        if (!lastNotified) {
          toast(`Birthday Reminder!`, {
            description: `${b.name}'s birthday is ${notification.type.toLowerCase()}!`,
            action: {
              label: "Wish them",
              onClick: () => console.log("Wish sent!"),
            },
          });
          localStorage.setItem(`notified_${b.id}_${notification.type}`, new Date().toISOString());
        }
      }
    });

    setNotifications(matches);
  }, [birthdays]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border/50 hover:bg-muted transition-all"
      >
        {notifications.length > 0 ? (
          <>
            <Bell className="h-5 w-5 text-primary" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {notifications.length}
            </span>
          </>
        ) : (
          <BellOff className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 z-50 w-80 rounded-2xl glass-card p-4 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-display font-bold">Smart Reminders</h3>
                <button onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className="flex items-center gap-3 p-2 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {n.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{n.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {n.type} is their birthday!
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-sm text-muted-foreground">
                    No reminders for today.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
