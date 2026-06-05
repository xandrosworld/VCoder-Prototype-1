import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15202b",
        graphite: "#2f3b45",
        mist: "#eef4f7",
        teal: "#0f8b8d",
        amber: "#f2a900",
        coral: "#e56b6f"
      }
    }
  },
  plugins: []
} satisfies Config;
