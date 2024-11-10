/** @type {import('tailwindcss').Config} */
module.exports = {
    //  darkMode:'class',
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  daisyui: {
    themes: [],
  },
  theme: {
   
  
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        lightTheme: {
           priBack:'#FFFFFF',
           btnBlue:'#0095f6',
           placeholder:'#737373',
           bluebtnhover:'#1877f2',
           termsCondition:'#00376B',
           input:'#FAFAFA',
           tabHover:'#F2F2F2',
           badgebg:'#EFEFEF',
           badgeHover:'#DBDBDB'
           


        },
        darkTheme:{
          priBack:'#000',
           btnBlue:'#0095f6',
           placeholder:'#A8A8A8',
           bluebtnhover:'#1877f2',
           termsCondition:'#00376B',
           input:'#121212',
           link:'#0095f6',
           termsCondition:'#e0f1ff',
           mainText:'#f5f5f5',
           tabHover:'#1A1A1A',
           dialog:'#262626',
           btnHover:'#555',
           badgeBg:'#363636'

        },
      },
     
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      animation:{
        "spin":"spin 0.7s linear forwards",
        "ping":"ping 0.6s linear forwards",
      }
    },
  },
  plugins: [require("tailwindcss-animate"),require('daisyui'),],
            
}