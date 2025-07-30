
"use client";

import { useEffect, useState } from "react";

export default function Footer() {
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="text-center text-muted-foreground text-sm mt-8">
            © {year ? year : ''} PhilSCA CampusPass. All rights reserved.
        </footer>
    );
}
