export function getZodiacSign(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: "Aquarius", element: "Air", icon: "♒" };
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return { sign: "Pisces", element: "Water", icon: "♓" };
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: "Aries", element: "Fire", icon: "♈" };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: "Taurus", element: "Earth", icon: "♉" };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: "Gemini", element: "Air", icon: "♊" };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: "Cancer", element: "Water", icon: "♋" };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: "Leo", element: "Fire", icon: "♌" };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: "Virgo", element: "Earth", icon: "♍" };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: "Libra", element: "Air", icon: "♎" };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: "Scorpio", element: "Water", icon: "♏" };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: "Sagittarius", element: "Fire", icon: "♐" };
  return { sign: "Capricorn", element: "Earth", icon: "♑" };
}

export function getElementColor(element: string) {
  switch (element) {
    case "Fire": return "text-orange-500 bg-orange-500/10";
    case "Water": return "text-blue-500 bg-blue-500/10";
    case "Air": return "text-gray-400 bg-gray-400/10";
    case "Earth": return "text-emerald-500 bg-emerald-500/10";
    default: return "text-primary bg-primary/10";
  }
}
