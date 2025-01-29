export const initializeDarkMode = (setDarkMode: (value: boolean) => void) => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        const isDark = storedTheme === 'dark';
        setDarkMode(isDark);
        document.documentElement.classList.toggle('dark', isDark);
    }
};

export const toggleDarkMode = (currentMode: boolean, setDarkMode: (value: boolean) => void) => {
    const newMode = !currentMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
}; 