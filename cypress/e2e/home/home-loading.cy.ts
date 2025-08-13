/**
 * Feature: Home Page Loading
 * 
 * As a user
 * I want the home page to load correctly with all required components
 * So that I can navigate to other parts of the application
 */

describe("Feature: Home Page Loading", () => {
  
  // Background: Navigate to home page
  beforeEach("Background: Setup home page", () => {
    // Given I navigate to the home page
    cy.visitHomeAndWait();
  });

  it("Scenario: Home page loads successfully", () => {
    // Then the page should be visible
    cy.get("body").should("be.visible");
    
    // And the page title should indicate this is Splunk EDUTRON
    cy.title().should("contain", "Splunk EDUTRON");
    
    cy.log("✅ Home page loaded successfully");
  });

  it("Scenario: Navigation to catalogs works", () => {
    // When I navigate to the catalogs page
    cy.visit("/catalogs");
    cy.waitForAppReady();
    cy.wait(2000);

    // Then the URL should include catalogs
    cy.url().should("include", "/catalogs");
    
    cy.log("✅ Successfully navigated to catalogs page");
  });
});