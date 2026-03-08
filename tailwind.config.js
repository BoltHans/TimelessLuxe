/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Playfair Display"', 'Georgia', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                gold: {
                    50: '#fdf9ee',
                    100: '#f9f0d3',
                    200: '#f3dfa0',
                    300: '#ecc86a',
                    400: '#e5b543',
                    500: '#d4982a',
                    600: '#b97c20',
                    700: '#95601c',
                    800: '#7c4e1e',
                    900: '#6a411d',
                },
                luxury: {
                    bg: '#0a0a0a',
                    card: '#141414',
                    border: '#2a2a2a',
                    muted: '#6b6b6b',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'shimmer': 'shimmer 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
        },
    },
    plugins: [],
};
