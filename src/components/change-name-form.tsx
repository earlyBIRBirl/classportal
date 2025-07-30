
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
import { updateUserDisplayName } from "@/lib/users";

const formSchema = z.object({
    displayName: z.string().min(1, { message: "Display name is required." }),
});

interface ChangeNameFormProps {
  studentNumber: string;
  currentDisplayName: string;
  onNameChanged: (newName: string) => void;
}

export default function ChangeNameForm({ studentNumber, currentDisplayName, onNameChanged }: ChangeNameFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: currentDisplayName,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const success = await updateUserDisplayName(studentNumber, values.displayName);
    if (success) {
      toast({
        title: "Success!",
        description: "Your display name has been updated.",
      });
      onNameChanged(values.displayName);
      form.reset({ displayName: values.displayName });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update display name. Please try again.",
      });
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Juan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
