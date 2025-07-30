
"use client";

import { useState, useEffect } from "react";
import LoginForm from "@/components/login-form";
import Dashboard from "@/components/dashboard";
import type { User } from "@/lib/users";
import { Card, CardContent } from "@/components/ui/card";
import { KeyRound } from "lucide-react";
import Footer from "@/components/footer";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.className = initialTheme;
  }, []);
  
  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const toggleTheme = () => {
    setTheme(currentTheme => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.className = newTheme;
        localStorage.setItem('theme', newTheme);
        return newTheme;
    });
  };

  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md lg:max-w-4xl">
          {!currentUser ? (
              <>
                  <div className="flex justify-center mb-6">
                  <div className="bg-primary rounded-full p-4 text-primary-foreground">
                      <KeyRound className="h-10 w-10" />
                  </div>
                  </div>
                  <h1 className="text-3xl font-bold text-center mb-2 text-foreground">
                  PhilSCA CampusPass
                  </h1>
                  <p className="text-center text-muted-foreground mb-8">
                  Secure access for PhilSCA students.
                  </p>
                  <Card className="shadow-lg bg-card text-card-foreground border-border">
                      <CardContent className="p-6">
                          <LoginForm onLogin={handleLogin} />
                      </CardContent>
                  </Card>
              </>
          ) : (
              <Dashboard 
                user={currentUser} 
                onLogout={handleLogout} 
                onUserUpdate={setCurrentUser}
                theme={theme}
                onThemeToggle={toggleTheme}
              />
          )}
          <Footer />
        </div>
      </main>
  );
}
