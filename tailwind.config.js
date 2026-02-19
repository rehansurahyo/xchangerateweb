/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    start: "var(--background-start)",
                    end: "var(--background-end)",
                },
                surface: "var(--surface)",
                border: "var(--border)",
                primary: "var(--primary)",

                // Design System Aliases
                bg: "var(--bg)",
                card: "var(--card)",
                text: "var(--text)",
                muted: "var(--muted)",

                accent: {
                    blue: "#2F80FF",
                    teal: "#22D3A6",
                },
                heading: "var(--heading)",
                body: "var(--body)",
            },
            borderRadius: {
                'card': '24px',
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(to right, #2F80FF, #22D3A6)',
            },
        },
    },
    plugins: [],
};
