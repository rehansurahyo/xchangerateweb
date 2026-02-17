/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    start: "#050A12",
                    end: "#070E18",
                },
                surface: "rgba(16, 24, 39, 0.6)",
                border: "rgba(255, 255, 255, 0.06)",
                primary: "#2F80FF",
                accent: {
                    blue: "#2F80FF",
                    teal: "#22D3A6",
                },
                heading: "#F5F7FF",
                body: "#9FB0C7",
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
