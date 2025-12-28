import daisyui from "daisyui";

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [daisyui, tailwindcss()],
  server: {
    "/api": {
      target: "http://localhost:5000",
    },
  },
});
