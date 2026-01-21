import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BirthdayProvider, useBirthdays } from "@/lib/BirthdayContext";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import CalendarView from "@/pages/CalendarView";
import Settings from "@/pages/Settings";
import SpecialDays from "@/pages/SpecialDays";
import Login from "@/pages/Login";
import Notes from "@/pages/Notes";

function Router() {
  const { currentUser } = useBirthdays();

  if (!currentUser) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route>
          <Redirect to="/login" />
        </Route>
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/calendar" component={CalendarView} />
      <Route path="/special" component={SpecialDays} />
      <Route path="/notes" component={Notes} />
      <Route path="/settings" component={Settings} />
      <Route path="/login">
        <Redirect to="/" />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <BirthdayProvider>
            <Router />
            <Toaster position="top-right" expand={true} richColors />
          </BirthdayProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
