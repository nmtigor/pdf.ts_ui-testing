import { defineConfig } from "cypress";
import { baseUrl } from "../pdf.ts/src/baseurl.mjs";

export default defineConfig({
  e2e: {
    baseUrl,
    specPattern: "gen/pdf.ts_ui-testing/src/**/*.cy.js",
    retries: {
      // Configure retry attempts for `cypress run`
      // Default is 0
      runMode: 3,
      // Configure retry attempts for `cypress open`
      // Default is 0
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // experimentalMemoryManagement: true,
  },
});
