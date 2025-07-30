
// This service uses Firebase Realtime Database to store user data.
"use client";

import { db } from "@/lib/firebase";
import { ref, get, set, child } from "firebase/database";

export interface User {
  studentNumber: string;
  passwordHash: string; // In a real app, never store plain text passwords
  fullName: string;
  role: 'admin' | 'student';
  displayName?: string;
}

const USERS_PATH = 'users';

// Default users to seed the database
const defaultUsers: User[] = [
    { fullName: "Arellano, Marcuz Gian M.", studentNumber: "12526MN-000001", passwordHash: "password123", role: "student" },
    { fullName: "Boloron, Jesam P.", studentNumber: "12526MN-000263", passwordHash: "password123", role: "student" },
    { fullName: "Cariño, Miguel Joey L.", studentNumber: "12526MN-000708", passwordHash: "password123", role: "admin" },
    { fullName: "Gallares, Elisha Denzelle R.", studentNumber: "12526MN-000387", passwordHash: "password123", role: "admin" },
    { fullName: "Puno, Reuben James B.", studentNumber: "12526MN-000307", passwordHash: "password123", role: "student" },
    { fullName: "Quimson, Reign Jewel M.", studentNumber: "12526MN-000308", passwordHash: "password123", role: "admin" },
    { fullName: "Regaspi, Lemuel V.", studentNumber: "12526MN-000309", passwordHash: "password123", role: "student" },
    { fullName: "Romasame, James Benedict D.", studentNumber: "12526MN-000310", passwordHash: "password123", role: "admin" },
    { fullName: "Romasanta, Keith Gabriel", studentNumber: "12526MN-000311", passwordHash: "password123", role: "student" },
    { fullName: "Romero, Michael Lawrence B.", studentNumber: "12526MN-000312", passwordHash: "password123", role: "student" },
    { fullName: "Roque, Christian Drew D.", studentNumber: "12526MN-000313", passwordHash: "password123", role: "student" },
    { fullName: "Salilin, Christian James T.", studentNumber: "12526MN-000314", passwordHash: "password123", role: "student" },
    { fullName: "San Juan, Lance Chezter C.", studentNumber: "12526MN-000315", passwordHash: "password123", role: "student" },
    { fullName: "Sardon, Jury Maine T.", studentNumber: "12526MN-000316", passwordHash: "password123", role: "admin" },
    { fullName: "Sayo, John Errol M.", studentNumber: "12526MN-000317", passwordHash: "password123", role: "student" },
    { fullName: "Servidad, Antoio Joaquin A.", studentNumber: "12526MN-000318", passwordHash: "password123", role: "student" },
    { fullName: "Simon, Emman Noel C.", studentNumber: "12526MN-000319", passwordHash: "password123", role: "student" },
    { fullName: "Soreda, Joseph Benedict M.", studentNumber: "12526MN-000320", passwordHash: "password123", role: "student" },
    { fullName: "Taboada, Earl Vince Nelson T.", studentNumber: "12526MN-000321", passwordHash: "password123", role: "admin" },
    { fullName: "Tachado, Cydnar C.", studentNumber: "12526MN-000322", passwordHash: "password123", role: "student" },
    { fullName: "Tan, Muhammad-Farouk II P.", studentNumber: "136889120764", passwordHash: "password123", role: "student" },
    { fullName: "Tenorio, Dwaine Joshua D.", studentNumber: "12526MN-000324", passwordHash: "password123", role: "admin" },
    { fullName: "Torres, Tristan Geoff S.", studentNumber: "12526MN-000326", passwordHash: "password123", role: "student" },
    { fullName: "Tuddao, Mark Paul Angelo B.", studentNumber: "12526MN-000331", passwordHash: "password123", role: "student" },
    { fullName: "Tugna, Jaymar T.", studentNumber: "12526MN-000327", passwordHash: "password123", role: "student" },
    { fullName: "Villanueva, Joffer F.", studentNumber: "12526MN-000328", passwordHash: "password123", role: "student" },
    { fullName: "Yangco, Francesca Andrea T.", studentNumber: "12526MN-000329", passwordHash: "password123", role: "student" },
    { fullName: "Yap, Mary Abigail D.", studentNumber: "103520120022", passwordHash: "password123", role: "student" },
];

const dbRef = ref(db);

// Function to seed the database with default users if it's empty
const seedDatabase = async () => {
    const snapshot = await get(child(dbRef, USERS_PATH));
    if (!snapshot.exists()) {
        const usersObject = defaultUsers.reduce((acc, user) => {
            acc[user.studentNumber] = user;
            return acc;
        }, {} as Record<string, User>);
        await set(child(dbRef, USERS_PATH), usersObject);
    }
};

// Seed the database on initial load
seedDatabase();

export const findUserByStudentNumber = async (studentNumber: string): Promise<User | undefined> => {
    try {
        const snapshot = await get(child(dbRef, `${USERS_PATH}/${studentNumber}`));
        if (snapshot.exists()) {
            return snapshot.val() as User;
        }
        return undefined;
    } catch (error) {
        console.error("Error finding user:", error);
        return undefined;
    }
};

export const updateUserPassword = async (studentNumber: string, newPasswordHash: string): Promise<boolean> => {
    try {
        const userRef = child(dbRef, `${USERS_PATH}/${studentNumber}/passwordHash`);
        await set(userRef, newPasswordHash);
        return true;
    } catch (error) {
        console.error("Error updating password:", error);
        return false;
    }
};

export const updateUserDisplayName = async (studentNumber: string, displayName: string): Promise<boolean> => {
    try {
        const userRef = child(dbRef, `${USERS_PATH}/${studentNumber}/displayName`);
        await set(userRef, displayName);
        return true;
    } catch (error) {
        console.error("Error updating display name:", error);
        return false;
    }
};
