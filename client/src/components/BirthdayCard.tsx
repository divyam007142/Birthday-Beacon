import { Birthday } from "@/lib/mock-data";
import { differenceInDays, format, setYear, isBefore, addYears, differenceInYears } from "date-fns";
import { Gift, Calendar as CalendarIcon, MoreVertical, Edit2, Trash2, ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBirthdays } from "@/lib/BirthdayContext";
import { useState } from "react";
import { AddBirthdayDialog } from "./AddBirthdayDialog";
import { BirthdayDetailDialog } from "./BirthdayDetailDialog";
import { getZodiacSign, getElementColor } from "@/lib/zodiac";

interface BirthdayCardProps {
  birthday: Birthday;
}

export function BirthdayCard({ birthday }: BirthdayCardProps) {
  const { deleteBirthday } = useBirthdays();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const today = new Date();
  const birthDate = new Date(birthday.date);
  let nextBirthday = setYear(birthDate, today.getFullYear());
  if (isBefore(nextBirthday, today)) {
    nextBirthday = addYears(nextBirthday, 1);
  }
  
  const daysUntil = differenceInDays(nextBirthday, today);
  const isToday = daysUntil === 0;
  
  const turningAge = differenceInYears(nextBirthday, birthDate);
  const countdownLabel = daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`;
  const zodiac = getZodiacSign(birthDate);

  return (
    <>
      <div 
        onClick={() => setIsDetailOpen(true)}
        className={cn(
          "group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-4 transition-all duration-300 cursor-pointer",
          isToday 
            ? "bg-linear-to-br from-primary/10 to-accent/10 border-primary/20 shadow-lg shadow-primary/10" 
            : "glass-card hover:border-primary/20"
        )}
      >
        {/* Avatar Area */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white/50 shadow-sm">
          {birthday.image ? (
            <img src={birthday.image} alt={birthday.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-secondary to-muted text-secondary-foreground">
              <span className="text-xl font-bold">{birthday.name[0]}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="truncate font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {birthday.name}
            </h3>
            <span className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              isToday ? "bg-primary text-primary-foreground animate-pulse" : "bg-primary/10 text-primary"
            )}>
              {countdownLabel}
            </span>
          </div>
          
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {format(birthDate, "MMM d")}
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="font-medium text-foreground/80">Turning {turningAge}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className={cn("px-1.5 py-0.5 rounded-md flex items-center gap-1 font-bold uppercase tracking-tighter text-[9px]", getElementColor(zodiac.element))}>
              {zodiac.icon} {zodiac.sign}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsDetailOpen(true)}>
                <ExternalLink className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                <Edit2 className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => deleteBirthday(birthday.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Background Decoration */}
        {isToday && (
          <div className="absolute -right-4 -top-4 -z-10 h-24 w-24 rounded-full bg-linear-to-br from-primary/20 to-accent/20 blur-2xl" />
        )}
      </div>

      <AddBirthdayDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        birthdayToEdit={birthday} 
      />
      <BirthdayDetailDialog
        birthday={birthday}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </>
  );
}
