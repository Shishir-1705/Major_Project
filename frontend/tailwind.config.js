/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc",
        surface: "#ffffff",
        panel: {
          DEFAULT: "#ffffff",
          subtle: "#f8fafc",
          border: "#e2e8f0",
          hover: "#f1f5f9",
        },
        brand: {
          teal: "#0d9488",
          'teal-dark': "#0f766e",
          'teal-light': "#f0fdfa",
          cyan: "#0284c7",
          'cyan-light': "#f0f9ff",
        },
        env: {
          ndvi: "#10b981",
          ndbi: "#8b5cf6",
        },
        thermal: {
          low: "#f59e0b",
          mid: "#ea580c",
          high: "#dc2626",
        }
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'floating': '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
