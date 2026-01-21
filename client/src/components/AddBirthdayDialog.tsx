import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useBirthdays } from "@/lib/BirthdayContext";
import { Birthday } from "@/lib/mock-data";
import { useEffect, useRef } from "react";
import { ImagePlus, Link as LinkIcon, Upload, Bell, Gift } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  relationship: z.enum(["Family", "Friend", "Work", "Other"]),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  notes: z.string().optional(),
  image: z.string().optional().or(z.literal("")),
  giftIdeas: z.string().optional(),
  reminders: z.object({
    oneDay: z.boolean().default(true),
    twoDays: z.boolean().default(false),
    sevenDays: z.boolean().default(false),
  }),
});

interface AddBirthdayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  birthdayToEdit?: Birthday;
}

export function AddBirthdayDialog({ open, onOpenChange, birthdayToEdit }: AddBirthdayDialogProps) {
  const { addBirthday, updateBirthday } = useBirthdays();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      date: "",
      relationship: "Friend",
      gender: "Male",
      notes: "",
      image: "",
      giftIdeas: "",
      reminders: { oneDay: true, twoDays: false, sevenDays: false },
    },
  });

  // Watch values for Select components
  const relationshipValue = form.watch("relationship");
  const genderValue = form.watch("gender");

  // Only reset the form when birthdayToEdit changes or when the dialog opens
  useEffect(() => {
    if (open) {
      if (birthdayToEdit) {
        const rawDate = birthdayToEdit.date;
        const dateObj = rawDate instanceof Date ? rawDate : new Date(rawDate);
        const dateStr = dateObj.toISOString().split("T")[0];

        form.reset({
          name: birthdayToEdit.name,
          date: dateStr,
          relationship: birthdayToEdit.relationship,
          gender: birthdayToEdit.gender || "Male",
          notes: birthdayToEdit.notes || "",
          image: birthdayToEdit.image || "",
          giftIdeas: (birthdayToEdit.giftIdeas || []).join(", "),
          reminders: birthdayToEdit.reminders || { oneDay: true, twoDays: false, sevenDays: false },
        });
      } else {
        form.reset({
          name: "",
          date: "",
          relationship: "Friend",
          gender: "Male",
          notes: "",
          image: "",
          giftIdeas: "",
          reminders: { oneDay: true, twoDays: false, sevenDays: false },
        });
      }
    }
  }, [open, birthdayToEdit?.id]); // Only run when open or the ID of the birthday changes

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const [year, month, day] = values.date.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const birthdayData = {
      name: values.name,
      relationship: values.relationship,
      gender: values.gender,
      notes: values.notes,
      image: values.image || "",
      giftIdeas: values.giftIdeas ? values.giftIdeas.split(",").map(i => i.trim()).filter(Boolean) : [],
      reminders: values.reminders,
      date: date,
    } as any;

    if (birthdayToEdit) {
      updateBirthday(birthdayToEdit.id, birthdayData);
    } else {
      addBirthday(birthdayData);
    }
    
    onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-card border-none max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-8">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-black tracking-tighter">
            {birthdayToEdit ? "Edit Birthday" : "Add Birthday"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Name</Label>
            <Input id="name" {...form.register("name")} className="bg-white/50 rounded-xl h-12" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Date</Label>
              <Input type="date" id="date" {...form.register("date")} className="bg-white/50 rounded-xl h-12" />
              {form.formState.errors.date && (
                 <p className="text-xs text-destructive">{form.formState.errors.date.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relationship" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Relationship</Label>
              <Select 
                onValueChange={(val) => form.setValue("relationship", val as any)}
                value={relationshipValue}
              >
                <SelectTrigger className="bg-white/50 rounded-xl h-12">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Family">Family</SelectItem>
                  <SelectItem value="Friend">Friend</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Gender</Label>
            <Select 
              onValueChange={(val) => form.setValue("gender", val as any)}
              value={genderValue}
            >
              <SelectTrigger className="bg-white/50 rounded-xl h-12">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              <Bell className="h-3 w-3 text-primary" /> Reminders
            </Label>
            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border/50 p-4 bg-muted/30">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rem-7" 
                  checked={form.watch("reminders.sevenDays")}
                  onCheckedChange={(checked) => form.setValue("reminders.sevenDays", !!checked)}
                />
                <label htmlFor="rem-7" className="text-sm font-medium leading-none">7 days before</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rem-2" 
                  checked={form.watch("reminders.twoDays")}
                  onCheckedChange={(checked) => form.setValue("reminders.twoDays", !!checked)}
                />
                <label htmlFor="rem-2" className="text-sm font-medium leading-none">2 days before</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rem-1" 
                  checked={form.watch("reminders.oneDay")}
                  onCheckedChange={(checked) => form.setValue("reminders.oneDay", !!checked)}
                />
                <label htmlFor="rem-1" className="text-sm font-medium leading-none">1 day before</label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Profile Image</Label>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 rounded-lg p-1">
                <TabsTrigger value="upload" className="text-xs flex items-center gap-1 rounded-md">
                  <Upload className="h-3 w-3" /> Gallery
                </TabsTrigger>
                <TabsTrigger value="link" className="text-xs flex items-center gap-1 rounded-md">
                  <LinkIcon className="h-3 w-3" /> Link
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-2">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-2xl p-6 cursor-pointer hover:bg-muted/50 transition-all"
                >
                  {form.watch("image") && (form.watch("image")?.startsWith("data:") || form.watch("image")?.startsWith("http")) ? (
                    <img src={form.watch("image")} className="h-20 w-20 rounded-2xl object-cover mb-2 shadow-lg" />
                  ) : (
                    <ImagePlus className="h-10 w-10 text-muted-foreground mb-2 opacity-50" />
                  )}
                  <span className="text-xs font-bold text-muted-foreground">Drop image or click</span>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                </div>
              </TabsContent>
              <TabsContent value="link" className="mt-2">
                <Input {...form.register("image")} placeholder="https://unsplash.com/photo..." className="bg-white/50 rounded-xl h-12" />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="giftIdeas" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1">
              <Gift className="h-3 w-3 text-primary" /> Gift Ideas
            </Label>
            <Input id="giftIdeas" {...form.register("giftIdeas")} placeholder="Watch, Book, Perfume (comma separated)" className="bg-white/50 rounded-xl h-12" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Notes</Label>
            <Textarea id="notes" {...form.register("notes")} className="bg-white/50 resize-none rounded-xl" rows={3} />
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-14 rounded-2xl text-lg font-black tracking-tighter shadow-xl shadow-primary/20 transition-all active:scale-95">
              {birthdayToEdit ? "Update Details" : "Create Reminder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
