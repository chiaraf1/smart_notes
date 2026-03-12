import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    // Render free tier can take up to 60s to wake up — increase timeouts
    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
    responseTimeout: 60000,
    env: {
      apiUrl: "https://smart-notes-lc14.onrender.com",
    },
  },
});
