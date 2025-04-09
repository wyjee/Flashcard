'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggleButton() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // 초기 테마 상태 설정
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setDarkMode(true);
        }
    }, []);

    const toggleTheme = () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setDarkMode(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 px-4 py-2 text-sm rounded bg-secondary-500 text-white hover:bg-secondary-600 transition"
        >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
    );
}