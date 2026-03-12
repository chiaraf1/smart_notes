// AUTH TESTS
// These tests check that login and register work correctly.
// They run against the real app in the browser — no mocking.

// We use a random email each time so tests don't fail because
// "this email is already registered" from a previous test run.
const email = `test_${Date.now()}@example.com`;
const password = "password123";

describe("Authentication", () => {

  // Before every test, clear localStorage and navigate to the landing page.
  // Then click "Log in" to get to the auth form — the app now shows a landing page first.
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/");
    cy.contains("Log in").click();
  });

  // TEST 1: The login page should show up after clicking Log in.
  // Why: If the auth page doesn't render, nothing else can work.
  it("shows the login form on first visit", () => {
    cy.get(".authCard").should("exist");
    cy.get("#auth-email").should("exist");
    cy.get("#auth-password").should("exist");
  });

  // TEST 2: You can switch between login and register mode.
  // Why: The toggle button is critical — without it new users can't sign up.
  it("switches between login and register mode", () => {
    // By default we're in login mode
    cy.get(".authTitle").should("contain", "Welcome back");

    // Click "Sign up"
    cy.get(".authLink").click();

    // Now we should be in register mode
    cy.get(".authTitle").should("contain", "Create account");

    // Click "Log in" to go back
    cy.get(".authLink").click();
    cy.get(".authTitle").should("contain", "Welcome back");
  });

  // TEST 3: Register a brand new account successfully.
  // Why: Core feature — if register is broken, no one can use the app.
  it("registers a new account and lands on the dashboard", () => {
    // Switch to register mode
    cy.get(".authLink").click();

    cy.get("#auth-email").type(email);
    cy.get("#auth-password").type(password);
    cy.get(".authBtn").click();

    // After successful register, the dashboard layout should appear
    cy.get(".layout").should("exist");
  });

  // TEST 4: Login with wrong password shows an error.
  // Why: We need to show users why they can't get in, not silently fail.
  it("shows an error for wrong password", () => {
    cy.get("#auth-email").type(email);
    cy.get("#auth-password").type("wrongpassword");
    cy.get(".authBtn").click();

    // An error message should appear
    cy.get(".error").should("exist");
  });

  // TEST 5: Login with correct credentials works.
  // Why: The most basic thing the app must do.
  it("logs in with correct credentials", () => {
    cy.get("#auth-email").type(email);
    cy.get("#auth-password").type(password);
    cy.get(".authBtn").click();

    cy.get(".layout").should("exist");
  });

  // TEST 6: After login, refreshing the page keeps you logged in.
  // Why: The token is stored in localStorage — if this breaks, users get
  // logged out every time they refresh, which is extremely frustrating.
  it("stays logged in after page refresh", () => {
    cy.get("#auth-email").type(email);
    cy.get("#auth-password").type(password);
    cy.get(".authBtn").click();
    cy.get(".layout").should("exist");

    // Reload the page
    cy.reload();

    // Should still be on the dashboard, not back at the login screen
    cy.get(".layout").should("exist");
  });

});
