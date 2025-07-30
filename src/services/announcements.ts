// This service uses Firebase Realtime Database.
"use client";

import { db } from "@/lib/firebase";
import { ref as dbRef, set, push, onValue, off, remove } from "firebase/database";

export type Announcement = {
    id: string;
    title: string;
    date: string;
    category: string;
    content: string;
};

const ANNOUNCEMENTS_PATH = 'announcements';

// This function now subscribes to real-time updates.
// The callback will be executed every time the data changes.
export const subscribeToAnnouncements = (callback: (announcements: Announcement[]) => void): (() => void) => {
    const announcementsRef = dbRef(db, ANNOUNCEMENTS_PATH);
    
    const listener = onValue(announcementsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const announcementsList: Announcement[] = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            callback(announcementsList);
        } else {
            callback([]);
        }
    });

    // Return the unsubscribe function
    return () => off(announcementsRef, 'value', listener);
};

export const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'date'>): Promise<string> => {
    const announcementsRef = dbRef(db, ANNOUNCEMENTS_PATH);
    const newAnnouncementRef = push(announcementsRef);
    
    const newAnnouncement: Omit<Announcement, 'id'> = {
        title: announcement.title,
        content: announcement.content,
        category: announcement.category,
        date: new Date().toISOString().split('T')[0],
    };

    await set(newAnnouncementRef, newAnnouncement);
    return newAnnouncementRef.key!;
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
    const announcementRef = dbRef(db, `${ANNOUNCEMENTS_PATH}/${id}`);
    await remove(announcementRef);
};
