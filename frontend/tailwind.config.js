/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0f19",
        panel: {
          DEFAULT: "#111827",
          border: "#1f2937",
          hover: "#1e293b",
        },
        brand: {
          cyan: "#06b6d4",
          teal: "#0891b2",
        },
        env: {
          ndvi: "#10b981",
          ndbi: "#a855f7",
        },
        thermal: {
          low: "#f59e0b",
          mid: "#f97316",
          high: "#ef4444",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
