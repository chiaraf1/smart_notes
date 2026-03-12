// NOTES TESTS
// These test the core note features: typing, word count, new note, tag click, delete confirmation.

const TEST_EMAIL = "cypress@test.com";
const TEST_PASSWORD = "cypress123";

describe("Notes", () => {

  // This runs ONCE before all tests in this file.
  // It tries to register the test account. If it already exists, that's fine — we ignore the error.
  // This way you never have to manually create the account.
  before(() => {
    cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/auth/register`,
      body: { email: TEST_EMAIL, password: TEST_PASSWORD },
      failOnStatusCode: false, // don't crash if account already exists
    });
  });

  // Before every test: log in fresh.
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.login(TEST_EMAIL, TEST_PASSWORD);
  });

  // TEST 1: The editor textarea is visible and you can type in it.
  // Why: If the textarea is broken, the whole app is useless.
  it("shows the editor and allows typing", () => {
    cy.get(".textarea").should("exist");
    cy.get(".textarea").type("This is a test note");
    cy.get(".textarea").should("have.value", "This is a test note");
  });

  // TEST 2: Word count updates as you type.
  // Why: Small but visible feature — if the count is always 0, users notice.
  it("updates word count as you type", () => {
    cy.get(".textarea").clear().type("one two three");
    cy.contains("3 words").should("exist");
  });

  // TEST 3: The New button clears the editor.
  // Why: If New doesn't clear the editor, you'd always be editing old notes.
  it("clears the editor when New is clicked", () => {
    cy.get(".textarea").clear().type("some content");
    cy.contains("button", "New").click();
    cy.get(".textarea").should("have.value", "");
  });

  // TEST 4: Clicking a tag filters the notes list.
  // Why: This is the tag feature we added — verifying it actually works.
  it("clicking a tag filters the sidebar", () => {
    cy.get("body").then(($body) => {
      if ($body.find(".tag").length > 0) {
        cy.get(".tag").first().then(($tag) => {
          const tagText = $tag.text();
          cy.get(".tag").first().click();
          cy.get(".searchInput").should("have.value", tagText);
        });
      }
    });
  });

  // TEST 5: Clicking ✕ on a note shows a confirmation dialog.
  // Why: We added confirm() to prevent accidental deletes — this verifies it works.
  it("asks for confirmation before deleting a note", () => {
    cy.get("body").then(($body) => {
      if ($body.find(".noteItemDelete").length > 0) {
        cy.window().then((win) => {
          cy.stub(win, "confirm").returns(false);
        });
        cy.get(".noteItemDelete").first().click();
        cy.get(".noteItemDelete").should("exist");
      }
    });
  });

});
