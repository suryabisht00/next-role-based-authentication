"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { initializeDarkMode, toggleDarkMode } from "@/components/ui/darkMode";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Initialize dark mode based on stored preference
        initializeDarkMode(setIsDarkMode);
    }, []);

    const handleToggle = () => {
        toggleDarkMode(isDarkMode, setIsDarkMode);
    };

    return (
        <Button 
            variant="ghost"
            onClick={handleToggle}
            className="font-medium hover:bg-purple-50 hover:text-purple-600"
        >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
    );
} 