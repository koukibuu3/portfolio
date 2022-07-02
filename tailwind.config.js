module.exports = {
  content: ['src/**/*'],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '3rem',
        md: '2rem',
        lg: '5rem',
        xl: '7rem',
        '2xl': '20rem',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
