// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/app/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'background-light': '#ffffff',
                'background-dark': '#0f172a',
                'surface-light': '#f9fafb',
                'surface-dark': '#1e293b',
                'text-light': '#0f172a',
                'text-dark': '#e2e8f0',
                'primary-400': '#a78bfa',
                'primary-500': '#8b5cf6',
                'primary-600': '#7c3aed',
                'secondary-400': '#f472b6',
                'secondary-500': '#ec4899',
                'secondary-600': '#db2777',
            },
        },
    },

    plugins: [require("tailwindcss"), require("autoprefixer")],
};