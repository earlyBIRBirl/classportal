
// This service uses Firebase Realtime Database.
"use client";

import { db } from "@/lib/firebase";
import { ref as dbRef, set, push, onValue, off, remove } from "firebase/database";

export type CalendarEvent = {
    id: string;
    date: string; // Stored as "YYYY-MM-DD"
    title: string;
    description: string;
    type: 'event';
};

export type Assessment = {
    id: string;
    date: string; // Combined from dueDate and dueTime
    subject: string;
    title: string;
    description: string;
    type: 'assessment';
};

export type CalendarItem = CalendarEvent | Assessment;

const CALENDAR_ITEMS_PATH = 'calendarItems';

// This function now subscribes to real-time updates.
export const subscribeToCalendarItems = (callback: (items: CalendarItem[]) => void): (() => void) => {
    const itemsRef = dbRef(db, CALENDAR_ITEMS_PATH);

    const listener = onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const itemsList: CalendarItem[] = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })).sort((a, b) => a.date.localeCompare(b.date));
            callback(itemsList);
        } else {
            callback([]);
        }
    });

    // Return the unsubscribe function
    return () => off(itemsRef, 'value', listener);
};

export type NewCalendarEvent = { title: string; description: string; eventDate: string; };
export type NewAssessment = { subject: string; title: string; description: string; dueDate: string, dueTime: string };

export const addCalendarItem = async (
    item: NewCalendarEvent | NewAssessment,
    type: 'event' | 'assessment'
): Promise<string | null> => {
    const itemsRef = dbRef(db, CALENDAR_ITEMS_PATH);
    const newItemRef = push(itemsRef);

    let newItemData: Omit<CalendarItem, 'id'>;

    if (type === 'event') {
        const eventData = item as NewCalendarEvent;
        newItemData = {
            type: 'event',
            title: eventData.title,
            description: eventData.description,
            date: eventData.eventDate,
        }
    } else {
        const assessmentData = item as NewAssessment;
        newItemData = {
            type: 'assessment',
            title: assessmentData.title,
            subject: assessmentData.subject,
            description: assessmentData.description,
            date: new Date(`${assessmentData.dueDate}T${assessmentData.dueTime}`).toISOString(),
        }
    }
    
    try {
        await set(newItemRef, newItemData);
        return newItemRef.key!;
    } catch (error) {
        console.error("Failed to add calendar item:", error);
        return null;
    }
};

export const deleteCalendarItem = async (id: string): Promise<void> => {
    const itemRef = dbRef(db, `${CALENDAR_ITEMS_PATH}/${id}`);
    await remove(itemRef);
};
