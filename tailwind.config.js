/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Covers all common frontend file types
    "./src/**/**/*.{js,ts,jsx,tsx}", // Extra depth for nested components (optional)
  ],
  theme: {
    extend: {
      colors: {
        // Example: Add your brand colors here if needed
        // primary: '#1e293b',
      },
      fontFamily: {
        // Example: Add custom fonts if needed
        // sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    // Example: Add official plugins like forms or typography if needed
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
