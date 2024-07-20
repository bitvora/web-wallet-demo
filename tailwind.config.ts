import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    colors: {
      transparent: 'transparent',
      black: '#0C0911',
      white: '#EFEDF1',
      primary: '#5C487F',
      gold: '#C69A71',
      light: '#9791A1',
      inputBorder: '#4B4653',
      error: '#D54D4D',
      purple: '#100C17',
      outlined: '#221e2b'
    },
    extend: {
      transitionProperty: {
        opacity: 'opacity'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')],
  important: true
};
export default config;
