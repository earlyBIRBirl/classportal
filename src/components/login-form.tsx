
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { findUserByStudentNumber, type User } from "@/lib/users";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import ForgotPasswordForm from "./forgot-password-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { ToastAction } from "@/components/ui/toast";

const formSchema = z.object({
  studentNumber: z.string().min(1, {
    message: "Student number is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentNumber: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    const user = await findUserByStudentNumber(values.studentNumber);

    if (user && user.passwordHash === values.password) {
      onLogin(user);
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid student number or password.",
        action: (
          <ToastAction altText="Forgot Password" onClick={() => setIsForgotPasswordOpen(true)}>
              Forgot Password
          </ToastAction>
        ),
      });
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in duration-500">
            <FormField
            control={form.control}
            name="studentNumber"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Student Number</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. 1001" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log In
            </Button>
        </form>
      </Form>
      <DialogContent>
          <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                  Enter your student number and full name to reset your password.
              </DialogDescription>
          </DialogHeader>
          <ForgotPasswordForm onPasswordChanged={() => setIsForgotPasswordOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
