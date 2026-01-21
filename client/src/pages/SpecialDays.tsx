import { Shell } from "@/components/layout/Shell";
import { useBirthdays } from "@/lib/BirthdayContext";
import { Sparkles, Gift, Star, Zap, Heart, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { differenceInYears, setYear, isBefore, addYears, format } from "date-fns";

export default function SpecialDays() {
  const { birthdays } = useBirthdays();
  const today = new Date();

  const milestones = birthdays.map(b => {
    let nextDate = setYear(b.date, today.getFullYear());
    if (isBefore(nextDate, today)) nextDate = addYears(nextDate, 1);
    const turningAge = differenceInYears(nextDate, b.date);
    const isMilestone = [1, 5, 10, 13, 16, 18, 21, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100].includes(turningAge);
    return { ...b, nextDate, turningAge, isMilestone };
  }).filter(b => b.isMilestone).sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());

  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">Special Days</h1>
            <p className="text-muted-foreground">Automatic tracking of life's biggest milestones.</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="h-7 w-7" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-card border-none bg-linear-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" /> What are Special Days?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Special Days automatically identifies **Milestone Birthdays** (like 1st, 18th, 21st, 50th) so you never miss a major life event.</p>
              <p>We analyze your list to highlight upcoming ages that deserve an extra special celebration.</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-none bg-linear-to-br from-accent/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Why use this?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>While the Dashboard shows everyone, this screen helps you plan ahead for the big ones. No more "Oh, I didn't realize they were turning 30!" moments.</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" /> Upcoming Milestones
          </h2>
          
          <div className="grid gap-4">
            {milestones.length > 0 ? (
              milestones.map(b => (
                <div key={b.id} className="glass-card p-6 rounded-3xl flex items-center justify-between group hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl overflow-hidden bg-primary/10 flex items-center justify-center border-2 border-white/50">
                      {b.image ? <img src={b.image} className="h-full w-full object-cover" /> : <span className="text-2xl font-bold text-primary">{b.name[0]}</span>}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{b.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(b.nextDate, "MMM d, yyyy")}</span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Turning {b.turningAge}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Big Milestone</p>
                    <p className="text-2xl font-black font-display tracking-tighter">#{b.turningAge}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-3xl border-dashed">
                <Heart className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <p className="text-muted-foreground">No major milestones found in your current list.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
