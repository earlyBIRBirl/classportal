
"use client";

import { Button } from "@/components/ui/button";
import { type User } from "@/lib/users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChangePasswordForm from "./change-password-form";
import ChangeNameForm from "./change-name-form";
import { useState } from "react";
import { LogOut, Lock, User as UserIcon, PlusCircle, Moon, Sun, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarView from "./calendar-view";
import Announcements from "./announcements";
import { Card } from "./ui/card";

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export default function Dashboard({ user, onLogout, onUserUpdate, theme, onThemeToggle }: DashboardProps) {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);

  const getDisplayName = () => {
    if (!user) return "";
    if (user.displayName) return user.displayName;
    return user.fullName.split(',')[1]?.trim() || "";
  }

  return (
    <div className="w-full animate-in fade-in duration-500">
       <header className="flex items-center justify-between mb-6 px-1">
        <div>
            <h2 className="text-2xl font-semibold text-foreground">Welcome Back, {getDisplayName()}!</h2>
            <p className="text-muted-foreground">
                {user.role === 'admin' ? 'Administrator' : `Student #${user.studentNumber}`}
            </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onThemeToggle} className="rounded-full">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <UserIcon className="h-5 w-5" />
                        <span className="sr-only">User Menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => setIsNameDialogOpen(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Change Name</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setIsPasswordDialogOpen(true)}>
                            <Lock className="mr-2 h-4 w-4" />
                            <span>Change Password</span>
                        </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log Out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      
      <Card>
        <Tabs defaultValue="calendar" className="w-full">
            <div className="p-6 border-b">
                <TabsList>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    <TabsTrigger value="announcements">Announcements</TabsTrigger>
                </TabsList>
            </div>
          <TabsContent value="calendar" className="mt-0 p-6">
              <CalendarView isAdmin={user.role === 'admin'} />
          </TabsContent>
          <TabsContent value="announcements" className="mt-0 p-6">
              <Announcements isAdmin={user.role === 'admin'}/>
          </TabsContent>
        </Tabs>
      </Card>


      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your old and new password below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <ChangePasswordForm
            studentNumber={user.studentNumber}
            onPasswordChanged={(newPassword) => {
              onUserUpdate({ ...user, passwordHash: newPassword });
              setIsPasswordDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Display Name</DialogTitle>
            <DialogDescription>
                Enter the name you'd like to be called.
            </DialogDescription>
          </DialogHeader>
          <ChangeNameForm
            studentNumber={user.studentNumber}
            currentDisplayName={user.displayName || ''}
            onNameChanged={(newName) => {
                onUserUpdate({ ...user, displayName: newName });
                setIsNameDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
