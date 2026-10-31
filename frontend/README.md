npm create vite@latest frontend -- --template react

npm install tailwindcss @tailwindcss/vite react-router-dom

Add "@import "tailwindcss";" in index.css

Update vite.config.js to this :-
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});



App.jsx
Home.jsx
Login.jsx
Register.jsx