export interface Birthday {
  id: string;
  name: string;
  date: Date;
  relationship: "Family" | "Friend" | "Work" | "Other";
  gender?: "Male" | "Female" | "Other";
  notes?: string;
  image?: string;
  giftIdeas?: string[];
  reminders?: {
    oneDay: boolean;
    twoDays: boolean;
    sevenDays: boolean;
  };
}

export const MOCK_BIRTHDAYS: Birthday[] = [];
