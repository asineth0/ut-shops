const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.vue"],
  theme: {
    extend: {
      colors: {
        gray: {
          100: "hsl(0, 0%, 93%)",
          200: "hsl(0, 0%, 88%)",
          300: "hsl(0, 0%, 73%)",
          400: "hsl(0, 0%, 40%)",
          500: "hsl(0, 0%, 27%)",
          600: "hsl(0, 0%, 16%)",
          700: "hsl(0, 0%, 12%)",
          800: "hsl(0, 0%, 9%)",
          900: "hsl(0, 0%, 6%)",
        },
        primary: colors.purple,
      },
      cursor: {
        none: "none",
      },
    },
  },
};
