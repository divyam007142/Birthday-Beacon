import React, { createContext, useContext, useState, useEffect } from "react";
import { Birthday } from "./mock-data";
import { toast } from "sonner";

interface UserProfile {
  name: string;
  image?: string;
  birthday?: string;
  gender?: "Male" | "Female" | "Other";
  notificationsEnabled?: boolean;
  autoArchive?: boolean;
}

interface UserAuth {
  email: string;
  password: string;
}

interface Note {
  id: string;
  title: string;
  description: string;
  backgroundImage?: string;
  createdAt: string;
}

interface BirthdayContextType {
  birthdays: Birthday[];
  notes: Note[];
  userProfile: UserProfile;
  currentUser: UserAuth | null;
  addBirthday: (birthday: Omit<Birthday, "id">) => void;
  updateBirthday: (id: string, birthday: Partial<Birthday>) => void;
  deleteBirthday: (id: string) => void;
  addNote: (note: Omit<Note, "id" | "createdAt">) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  updateUserProfile: (profile: UserProfile) => void;
  register: (user: UserAuth) => boolean;
  login: (user: UserAuth) => boolean;
  logout: () => void;
}

const BirthdayContext = createContext<BirthdayContextType | undefined>(undefined);

const STORAGE_KEY = "remindme_birthdays";
const PROFILE_KEY = "remindme_user_profile";
const USERS_KEY = "remindme_registered_users";
const AUTH_KEY = "remindme_current_user";
const NOTES_KEY = "remindme_notes";

export function BirthdayProvider({ children }: { children: React.ReactNode }) {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: "Guest User", gender: "Other", notificationsEnabled: true, autoArchive: false });
  const [currentUser, setCurrentUser] = useState<UserAuth | null>(null);

  // Load data ONLY when a user is logged in
  useEffect(() => {
    if (currentUser) {
      const userSuffix = `_${currentUser.email}`;
      
      const savedBirthdays = localStorage.getItem(STORAGE_KEY + userSuffix);
      if (savedBirthdays) {
        try {
          const parsed = JSON.parse(savedBirthdays);
          setBirthdays(parsed.map((b: any) => ({
            ...b,
            date: new Date(b.date)
          })));
        } catch (e) {
          console.error("Failed to parse birthdays:", e);
          setBirthdays([]);
        }
      } else {
        setBirthdays([]);
      }

      const savedNotes = localStorage.getItem(NOTES_KEY + userSuffix);
      setNotes(savedNotes ? JSON.parse(savedNotes) : []);

      const savedProfile = localStorage.getItem(PROFILE_KEY + userSuffix);
      setUserProfile(savedProfile ? JSON.parse(savedProfile) : { name: currentUser.email.split('@')[0], gender: "Other", notificationsEnabled: true, autoArchive: false });
    } else {
      setBirthdays([]);
      setNotes([]);
      setUserProfile({ name: "Guest User", gender: "Other", notificationsEnabled: true, autoArchive: false });
    }
  }, [currentUser]);

  // Save data ONLY for the current user
  useEffect(() => {
    if (currentUser) {
      const userSuffix = `_${currentUser.email}`;
      localStorage.setItem(STORAGE_KEY + userSuffix, JSON.stringify(birthdays));
    }
  }, [birthdays, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const userSuffix = `_${currentUser.email}`;
      localStorage.setItem(NOTES_KEY + userSuffix, JSON.stringify(notes));
    }
  }, [notes, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const userSuffix = `_${currentUser.email}`;
      localStorage.setItem(PROFILE_KEY + userSuffix, JSON.stringify(userProfile));
    }
  }, [userProfile, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [currentUser]);

  // Handle data export/import for storage persistence in hybrid environments (like APKs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!currentUser) return;
      const userSuffix = `_${currentUser.email}`;
      
      if (e.key === STORAGE_KEY + userSuffix && e.newValue) {
        setBirthdays(JSON.parse(e.newValue).map((b: any) => ({ ...b, date: new Date(b.date) })));
      }
      if (e.key === NOTES_KEY + userSuffix && e.newValue) {
        setNotes(JSON.parse(e.newValue));
      }
      if (e.key === PROFILE_KEY + userSuffix && e.newValue) {
        setUserProfile(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Periodically force a save to ensure nothing is lost during unexpected shutdowns
    const backupInterval = setInterval(() => {
      if (currentUser) {
        const userSuffix = `_${currentUser.email}`;
        localStorage.setItem(STORAGE_KEY + userSuffix, JSON.stringify(birthdays));
        localStorage.setItem(NOTES_KEY + userSuffix, JSON.stringify(notes));
        localStorage.setItem(PROFILE_KEY + userSuffix, JSON.stringify(userProfile));
      }
    }, 10000); // Backup every 10 seconds

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(backupInterval);
    };
  }, [currentUser, birthdays, notes, userProfile]);

  const addBirthday = (data: Omit<Birthday, "id">) => {
    const newBirthday = { ...data, id: Math.random().toString(36).substr(2, 9) };
    setBirthdays((prev) => [...prev, newBirthday]);
    toast(`Birthday Added`, { description: `Added ${newBirthday.name} to your list.` });
  };

  const updateBirthday = (id: string, data: Partial<Birthday>) => {
    setBirthdays((prev) => {
      const updated = prev.map((b) => {
        if (b.id === id) {
          const mergedReminders = data.reminders ? { ...b.reminders, ...data.reminders } : b.reminders;
          return { ...b, ...data, reminders: mergedReminders };
        }
        return b;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return [...updated];
    });
    toast(`Details Updated`, { description: "Birthday information has been saved." });
  };

  const deleteBirthday = (id: string) => {
    setBirthdays((prev) => prev.filter((b) => b.id !== id));
    toast(`Birthday Deleted`, { description: "Removed from your list." });
  };

  const addNote = (data: Omit<Note, "id" | "createdAt">) => {
    const newNote = { 
      ...data, 
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setNotes((prev) => [newNote, ...prev]);
    toast(`Note Saved`, { description: "Your new note has been added." });
  };

  const updateNote = (id: string, data: Partial<Note>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...data } : n)));
    toast(`Note Updated`, { description: "Changes saved successfully." });
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    toast(`Note Deleted`, { description: "The note has been removed." });
  };

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    toast(`Profile Updated`, { description: "Your settings have been saved." });
  };

  const register = (user: UserAuth) => {
    const savedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as UserAuth[];
    if (savedUsers.find(u => u.email === user.email)) {
      toast(`Registration Failed`, { description: "Registration failed - user has already been registered." });
      return false;
    }
    const updatedUsers = [...savedUsers, user];
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    toast(`Registered Successfully`, { description: "You can now login." });
    return true;
  };

  const login = (user: UserAuth) => {
    const savedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as UserAuth[];
    const userExists = savedUsers.find(u => u.email === user.email);
    
    if (!userExists) {
      toast(`Login Failed`, { description: "User hasn't been registered." });
      return false;
    }

    const foundUser = savedUsers.find(u => u.email === user.email && u.password === user.password);
    if (foundUser) {
      setCurrentUser(foundUser);
      toast(`Welcome Back`, { description: `Welcome back, ${foundUser.email.split('@')[0]} 😁` });
      return true;
    }
    toast(`Login Failed`, { description: "Invalid email/user or password." });
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    toast(`Logged Out`, { description: "See you soon!" });
  };

  return (
    <BirthdayContext.Provider value={{ 
      birthdays, 
      notes,
      userProfile, 
      currentUser,
      addBirthday, 
      updateBirthday, 
      deleteBirthday, 
      addNote,
      updateNote,
      deleteNote,
      updateUserProfile,
      register,
      login,
      logout
    }}>
      {children}
    </BirthdayContext.Provider>
  );
}

export function useBirthdays() {
  const context = useContext(BirthdayContext);
  if (!context) throw new Error("useBirthdays must be used within a BirthdayProvider");
  return context;
}
