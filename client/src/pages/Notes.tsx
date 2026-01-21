import { Shell } from "@/components/layout/Shell";
import { useBirthdays } from "@/lib/BirthdayContext";
import { useState } from "react";
import { Plus, Trash2, Edit3, Save, X, NotebookPen, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import noteBg1 from "@assets/IMG-20260120-WA0001_1768901355346.jpg";
import noteBg2 from "@assets/stock_images/abstract_elegant_art_086bccc0.jpg";
import noteBg3 from "@assets/stock_images/abstract_elegant_art_a482a810.jpg";
import noteBg4 from "@assets/stock_images/abstract_elegant_art_39ba7425.jpg";
import noteBg5 from "@assets/stock_images/abstract_elegant_art_acd0f938.jpg";

const BACKGROUNDS = [
  { id: 'bg1', url: noteBg1, name: 'Classic' },
  { id: 'bg2', url: noteBg2, name: 'Ethereal' },
  { id: 'bg3', url: noteBg3, name: 'Silk' },
  { id: 'bg4', url: noteBg4, name: 'Harmony' },
  { id: 'bg5', url: noteBg5, name: 'Luxe' },
];

export default function Notes() {
  const { notes, addNote, updateNote, deleteNote } = useBirthdays();
  const [isOpen, setIsOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBg, setSelectedBg] = useState<string | null>(null);

  const handleOpen = (note?: any) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setDescription(note.description);
      setSelectedBg(note.backgroundImage || null);
    } else {
      setEditingNote(null);
      setTitle("");
      setDescription("");
      setSelectedBg(null);
    }
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      description,
      backgroundImage: selectedBg || undefined
    };

    if (editingNote) {
      updateNote(editingNote.id, data);
    } else {
      addNote(data);
    }
    setIsOpen(false);
  };

  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">My Notes</h1>
            <p className="text-muted-foreground">Store your thoughts and gift planning notes.</p>
          </div>
          <Button onClick={() => handleOpen()} className="rounded-2xl gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5" /> New Note
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div 
              key={note.id}
              className="group relative h-64 overflow-hidden rounded-[2rem] border border-border/50 bg-card/50 backdrop-blur-xl transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10"
            >
              {note.backgroundImage ? (
                <div className="absolute inset-0 z-0">
                  <img src={note.backgroundImage} className="h-full w-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
                </div>
              ) : (
                <div className="absolute inset-0 z-0 bg-linear-to-br from-primary/5 to-accent/5" />
              )}

              <div className="relative z-10 flex h-full flex-col p-6">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground line-clamp-1 drop-shadow-sm">{note.title}</h3>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button 
                      onClick={() => handleOpen(note)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 hover:bg-primary hover:text-white transition-colors shadow-sm"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 hover:bg-destructive hover:text-white transition-colors shadow-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm text-foreground/90 font-medium line-clamp-6 leading-relaxed drop-shadow-sm">
                  {note.description}
                </p>
                <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center glass-card rounded-[3rem]">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <NotebookPen className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold">No notes yet</h2>
              <p className="text-muted-foreground max-w-xs mt-2">Create your first note to keep track of gift ideas, party plans, and more.</p>
              <Button onClick={() => handleOpen()} variant="outline" className="mt-6 rounded-xl">
                Add Note
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg glass-card border-none rounded-t-[2.5rem] sm:rounded-[2.5rem] p-0 overflow-hidden top-auto bottom-0 sm:top-[50%] translate-y-0 sm:translate-y-[-50%] max-h-[90vh] flex flex-col">
          <div className="overflow-y-auto p-8 custom-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-bold">
                {editingNote ? "Edit Note" : "Create New Note"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Title</Label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Note Title" 
                  required 
                  className="h-12 rounded-xl bg-white/50 border-none focus-visible:ring-primary shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Content</Label>
                <Textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Write your note here..." 
                  required 
                  className="min-h-32 rounded-2xl bg-white/50 border-none focus-visible:ring-primary shadow-inner resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Choose Wallpaper</Label>
                <div className="grid grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBg(null)}
                    className={`relative aspect-square rounded-xl border-2 transition-all ${!selectedBg ? 'border-primary shadow-md' : 'border-transparent bg-muted/50'}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase">None</div>
                    {!selectedBg && <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5"><Check className="h-2 w-2" /></div>}
                  </button>
                  {BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setSelectedBg(bg.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedBg === bg.url ? 'border-primary shadow-md' : 'border-transparent'}`}
                    >
                      <img src={bg.url} className="h-full w-full object-cover" alt={bg.name} />
                      {selectedBg === bg.url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-white rounded-full p-0.5"><Check className="h-3 w-3" /></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <DialogFooter className="pt-4 flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl flex-1 shadow-lg shadow-primary/20">
                  {editingNote ? "Save Changes" : "Create Note"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
