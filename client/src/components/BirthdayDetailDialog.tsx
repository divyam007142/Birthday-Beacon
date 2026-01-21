import { Birthday } from "@/lib/mock-data";
import { format, differenceInDays, differenceInYears, setYear, isBefore, addYears, subDays } from "date-fns";
import { Gift, Calendar as CalendarIcon, User, Clock, Bell, MapPin, Smile, User2, Sparkles, Wand2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getZodiacSign, getElementColor } from "@/lib/zodiac";

interface BirthdayDetailDialogProps {
  birthday: Birthday;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BirthdayDetailDialog({ birthday, open, onOpenChange }: BirthdayDetailDialogProps) {
  const today = new Date();
  const birthDate = new Date(birthday.date);
  
  // Calculate next birthday
  let nextBirthday = setYear(birthDate, today.getFullYear());
  if (isBefore(nextBirthday, today)) {
    nextBirthday = addYears(nextBirthday, 1);
  }
  
  // Calculate last birthday
  let lastBirthday = setYear(birthDate, today.getFullYear());
  if (!isBefore(lastBirthday, today)) {
    lastBirthday = addYears(nextBirthday, -1);
  }

  const daysUntil = differenceInDays(nextBirthday, today);
  const daysSince = differenceInDays(today, lastBirthday);
  const ageTurning = differenceInYears(nextBirthday, birthDate);
  const currentAge = differenceInYears(today, birthDate);
  const zodiac = getZodiacSign(birthDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card border-none overflow-hidden p-0 rounded-[2.5rem]">
        <div className="relative h-32 bg-linear-to-br from-primary/20 to-accent/20">
          <div className="absolute -bottom-12 left-6">
            <div className="h-24 w-24 rounded-full border-4 border-background overflow-hidden bg-muted shadow-xl">
              {birthday.image ? (
                <img src={birthday.image} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-3xl font-bold bg-primary/10 text-primary">
                  {birthday.name[0]}
                </div>
              )}
            </div>
          </div>
          <div className="absolute top-4 right-6 flex gap-2">
             <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-1.5", getElementColor(zodiac.element))}>
              {zodiac.icon} {zodiac.sign}
            </span>
          </div>
        </div>

        <div className="px-6 pb-8 pt-16 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-display font-bold">{birthday.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground font-medium">{birthday.relationship}</p>
                {birthday.gender && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span className="text-xs font-semibold text-primary/70">{birthday.gender}</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
               <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {currentAge} Years Old
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-tight">Last Birthday</span>
              </div>
              <p className="font-bold">Turned {currentAge}</p>
              <p className="text-xs text-muted-foreground">{daysSince === 0 ? "Today" : `${daysSince} days ago`}</p>
            </div>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-1 text-primary">
                <Gift className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-tight">Next Birthday</span>
              </div>
              <p className="font-bold">Turning {ageTurning}</p>
              <p className="text-xs text-primary/70">In {daysUntil} days</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Preferences & Info</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Born on {format(birthDate, "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Reminders: {Object.entries(birthday.reminders || {})
                      .filter(([_, v]) => v)
                      .map(([k]) => k.replace(/([A-Z])/, ' $1').toLowerCase())
                      .join(', ') || 'None'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <span>Element: {zodiac.element}</span>
                </div>
              </div>
            </div>

            {birthday.giftIdeas && birthday.giftIdeas.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                  <Gift className="h-3.5 w-3.5 text-primary" /> Gift Ideas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {birthday.giftIdeas.map((gift, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-accent/10 text-accent text-xs font-bold border border-accent/10">
                      {gift}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {birthday.notes && (
              <div className="mt-2 p-4 rounded-2xl bg-muted/50 text-sm italic text-muted-foreground relative">
                <Smile className="absolute -top-2 -right-2 h-6 w-6 text-muted-foreground/20" />
                "{birthday.notes}"
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
