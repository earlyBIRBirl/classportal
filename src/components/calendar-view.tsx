
"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { addCalendarItem, deleteCalendarItem, subscribeToCalendarItems, type CalendarItem, type Assessment } from "@/services/calendar";

export default function CalendarView({ isAdmin }: { isAdmin: boolean }) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [items, setItems] = React.useState<CalendarItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = subscribeToCalendarItems((data) => {
      setItems(data);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);


  const handleAddItem = async (event: React.FormEvent<HTMLFormElement>, type: 'event' | 'assessment') => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    let newItem: Parameters<typeof addCalendarItem>[0];

    if (type === 'event') {
      newItem = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        eventDate: formData.get("date") as string,
      };
    } else { // assessment
      newItem = {
        subject: formData.get("subject") as string,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        dueDate: formData.get("dueDate") as string,
        dueTime: formData.get("dueTime") as string,
      };
    }
    
    await addCalendarItem(newItem, type);
    setIsDialogOpen(false);
    form.reset();
  };
  
  const handleDeleteItem = async (id: string) => {
    await deleteCalendarItem(id);
  };

  const toYYYYMMDD = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  const selectedDayItems = items.filter((item) => {
    if (!date) return false;
    const selectedDateStr = toYYYYMMDD(date);
    if (item.type === 'event') {
        return item.date === selectedDateStr;
    }
    // For assessments, compare just the date part of the ISO string
    return item.date.startsWith(selectedDateStr);
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calendar</h2>
            {isAdmin && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add to Calendar</DialogTitle>
                        </DialogHeader>
                        <Tabs defaultValue="event">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="event">Event</TabsTrigger>
                                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                            </TabsList>
                            <TabsContent value="event">
                                <form onSubmit={(e) => handleAddItem(e, 'event')} className="space-y-4 pt-4">
                                    <Input name="title" placeholder="Event Title" required />
                                    <Textarea name="description" placeholder="Event description..." />
                                    <Input name="date" type="date" required />
                                    <Button type="submit" className="w-full">Add Event</Button>
                                </form>
                            </TabsContent>
                            <TabsContent value="assessment">
                                <form onSubmit={(e) => handleAddItem(e, 'assessment')} className="space-y-4 pt-4">
                                    <Input name="subject" placeholder="Subject" required />
                                    <Input name="title" placeholder="Assessment Title (e.g. Final Exam)" required />
                                    <Textarea name="description" placeholder="Assessment description..." />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="dueDate">Due Date</Label>
                                            <Input id="dueDate" name="dueDate" type="date" required />
                                        </div>
                                        <div>
                                            <Label htmlFor="dueTime">Due Time</Label>
                                            <Input id="dueTime" name="dueTime" type="time" required />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full">Add Assessment</Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            )}
        </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 flex justify-center">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                components={{
                    DayContent: ({ date: day }) => {
                      const dayYYYYMMDD = toYYYYMMDD(day);
                      const isItemDay = items.some(item => item.date.startsWith(dayYYYYMMDD));
                      return (
                        <div className="relative flex items-center justify-center h-full w-full">
                          {day.getDate()}
                          {isItemDay && <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary" />}
                        </div>
                      );
                    },
                }}
            />
        </div>
        <div className="flex-1 space-y-4 min-w-0">
          <h3 className="text-lg font-semibold">
            Schedule for {date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "today"}
          </h3>
            {selectedDayItems.length > 0 ? (
              selectedDayItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                   <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-x-4 gap-y-1">
                        <p className="font-semibold break-words flex-1">{item.title}</p>
                        {item.type === 'assessment' && (
                            <Badge variant="secondary" className="whitespace-normal break-all">{(item as Assessment).subject}</Badge>
                        )}
                      </div>
                      {item.description && <p className="text-sm text-muted-foreground mt-1 break-words">{item.description}</p>}
                      <p className="text-sm text-muted-foreground mt-1">
                          {new Date(item.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                      </p>
                    </div>
                  {isAdmin && (
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="flex-shrink-0">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this item.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteItem(item.id)}>
                            Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No events or assessments for this day.</p>
            )}
        </div>
      </div>
    </div>
  );
}
