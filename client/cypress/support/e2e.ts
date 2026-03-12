// This file runs before every single test.
// We use it to add custom commands — reusable shortcuts for common actions.

// "cy.login(email, password)" — logs in via the UI so we don't repeat
// the same typing in every test that needs an authenticated user.
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/");
  // The app now shows a landing page first — click "Log in" to get to the auth form
  cy.contains("Log in").click();
  cy.get("#auth-email").type(email);
  cy.get("#auth-password").type(password);
  cy.get(".authBtn").click();
  // Wait until the dashboard is visible before the test continues
  cy.get(".layout").should("exist");
});
