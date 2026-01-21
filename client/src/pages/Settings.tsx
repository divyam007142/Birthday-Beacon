import { Shell } from "@/components/layout/Shell";
import { useBirthdays } from "@/lib/BirthdayContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useEffect, useState } from "react";
import { Camera, Save, User as UserIcon, Trash2, Shield, BellRing, Sparkles, Moon, Sun, LogOut } from "lucide-react";
import { differenceInYears } from "date-fns";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AnimatedToggle } from "@/components/AnimatedToggle";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  birthday: z.string().optional(),
  image: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  notificationsEnabled: z.boolean().default(true),
  autoArchive: z.boolean().default(false),
});

export default function Settings() {
  const { userProfile, updateUserProfile, logout } = useBirthdays();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userProfile.name,
      birthday: userProfile.birthday || "",
      image: userProfile.image || "",
      gender: (userProfile as any).gender || "Other",
      notificationsEnabled: (userProfile as any).notificationsEnabled ?? true,
      autoArchive: (userProfile as any).autoArchive ?? false,
    },
  });

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    updateUserProfile(values as any);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearData = () => {
    localStorage.removeItem("remindme_birthdays");
    localStorage.removeItem("remindme_user_profile");
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
  };

  const age = form.watch("birthday") 
    ? differenceInYears(new Date(), new Date(form.watch("birthday")!)) 
    : null;

  return (
    <Shell>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Settings</h1>
            <p className="text-muted-foreground">Personalize your experience and manage data.</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-12">
          {/* Profile Section */}
          <div className="glass-card p-8 rounded-3xl space-y-8">
            <h2 className="font-display text-xl font-bold flex items-center gap-2 text-foreground">
              <UserIcon className="h-5 w-5 text-primary" /> Profile Details
            </h2>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full border-4 border-white/50 shadow-xl overflow-hidden bg-muted flex items-center justify-center">
                  {form.watch("image") ? (
                    <img src={form.watch("image")} className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera className="h-5 w-5" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                />
              </div>
              
              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Full Name</Label>
                    <Input id="profile-name" {...form.register("name")} className="bg-white/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-gender">Gender</Label>
                    <Select 
                      onValueChange={(val) => form.setValue("gender", val as any)}
                      value={form.watch("gender")}
                    >
                      <SelectTrigger className="bg-white/50">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-birthday">Your Birthday</Label>
                  <Input type="date" id="profile-birthday" {...form.register("birthday")} className="bg-white/50" />
                  {age !== null && <p className="text-xs text-primary font-medium">You are {age} years old</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="glass-card p-8 rounded-3xl space-y-6">
            <h2 className="font-display text-xl font-bold flex items-center gap-2 text-foreground">
              <BellRing className="h-5 w-5 text-primary" /> App Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-base text-foreground">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
                </div>
                <AnimatedToggle />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-base text-foreground">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Get reminded on your device about upcoming events.</p>
                </div>
                <div className="flex items-center gap-2">
                  {Notification.permission === 'denied' && (
                    <span className="text-[10px] text-destructive font-bold uppercase">Blocked in Browser</span>
                  )}
                  <Switch 
                    checked={form.watch("notificationsEnabled")} 
                    onCheckedChange={async (val) => {
                      if (val && Notification.permission !== 'granted') {
                        const permission = await Notification.requestPermission();
                        if (permission !== 'granted') {
                          toast(`Permission Denied`, {
                            description: "Please enable notifications in your browser/app settings."
                          });
                          return;
                        }
                      }
                      form.setValue("notificationsEnabled", val);
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-base text-foreground">Smart Archiving</Label>
                  <p className="text-xs text-muted-foreground">Automatically hide birthdays you haven't interacted with in 2 years.</p>
                </div>
                <Switch 
                  checked={form.watch("autoArchive")} 
                  onCheckedChange={(val) => form.setValue("autoArchive", val)}
                />
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="glass-card p-8 rounded-3xl space-y-6 border-primary/20 bg-primary/5">
            <h2 className="font-display text-xl font-bold flex items-center gap-2 text-foreground">
              <Shield className="h-5 w-5 text-primary" /> Account
            </h2>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-primary/10">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Logout</Label>
                <p className="text-xs text-muted-foreground">Safely exit your session.</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-primary/20 hover:bg-primary/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-card border-none rounded-[2rem]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display font-bold">Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to log out of your account?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout} className="rounded-xl bg-primary text-white">Logout</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-card p-8 rounded-3xl border-destructive/20 space-y-6">
            <h2 className="font-display text-xl font-bold flex items-center gap-2 text-destructive">
              <Shield className="h-5 w-5" /> Danger Zone
            </h2>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-destructive/5 border border-destructive/10">
              <div className="space-y-0.5">
                <Label className="text-base text-destructive">Reset Application</Label>
                <p className="text-xs text-muted-foreground">This will permanently delete all your saved birthdays and settings.</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm"
                    className="rounded-xl shadow-lg shadow-destructive/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-card border-none rounded-[2rem]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display font-bold text-destructive">Reset Application?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your saved birthdays and settings. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearData} className="rounded-xl bg-destructive text-white shadow-lg shadow-destructive/20">Confirm Reset</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary py-8 rounded-2xl text-lg font-bold shadow-xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-95 text-white">
            <Save className="mr-2 h-6 w-6" /> Save All Settings
          </Button>
        </form>
      </div>
    </Shell>
  );
}

