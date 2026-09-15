/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-[#112240]',
    'text-white',
    'border-[#112240]',
    'bg-[#f5f3ed]',
    'text-[#43474d]',
    'border-[#c3c6ce]/30',
    'opacity-0',
    'opacity-100',
    'translate-y-0',
    'translate-y-2',
    '-translate-y-1',
    'text-[#1D9E75]',
    'text-[#45617d]',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
