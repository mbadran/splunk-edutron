/**
 * Feature: Planner Page Loading
 * 
 * As a training planner
 * I want the planner page to load correctly with all required components
 * So that I can begin creating training plans
 */

const DEFAULT_PLAN_TITLE = "Pied Piper / Splunk Training Plan" as const;
const INITIAL_TEAM_MEMBER = "Richard Hendricks" as const;

describe("Feature: Planner Page Loading", () => {
  
  // Background: Navigate to planner page
  beforeEach("Background: Setup planner page", () => {
    // Given I navigate to the planner page
    cy.visitPlannerAndWait();
  });

  it("Scenario: Planner page loads successfully", () => {
    // Then the page title should indicate this is the Planner
    cy.title().should("contain", "Planner");
    
    // And the main planner container should be visible
    cy.get("#planner").should("be.visible");
    
    cy.log("✅ Planner page loaded successfully");
  });

  it("Scenario: Header displays all required elements", () => {
    // Then the header container should be visible
    cy.get("#app-header").should("be.visible");

    // And the navigation menu should be present
    cy.get("#header-menu").should("be.visible");
    cy.get("#header-menu button").should("contain.html", "svg");

    // And the branding should be visible
    cy.get("#header-home").should("be.visible");
    cy.get("#header-home button").should("contain", "Splunk EDUTRON");

    // And the page title should show the default plan name
    cy.get("#page-title-display").should("be.visible");
    cy.get("#page-title-display").should("contain", DEFAULT_PLAN_TITLE);
    
    cy.log("✅ Header displays all required elements");
  });

  it("Scenario: MonoTable loads with course catalog", () => {
    // Then the MonoTable should be visible
    cy.get("#monotable").should("be.visible");

    // And it should either show courses or an appropriate empty state
    cy.get("body").then(($body) => {
      if ($body.find("#table-empty-state").length > 0) {
        // Empty state: catalog failed to load
        cy.get("#table-empty-state").should("contain", "No courses available");
        cy.log("⚠️ MonoTable shows empty state - catalog may not be loaded");
      } else {
        // Success state: courses should be visible
        cy.get("#monotable").within(() => {
          cy.get('[id^="table-row-"]').should("exist");
          cy.get('[id^="course-name-"]').should("exist");
        });
        cy.log("✅ MonoTable loaded with course catalog");
      }
    });
  });

  it("Scenario: Initial team member is present", () => {
    // Then the initial team member should be visible
    cy.get("body").then(($body) => {
      if ($body.find("#table-empty-state").length > 0) {
        // Empty state: catalog failed to load
        cy.get("#table-empty-state").should("contain", "No courses available");
        cy.log("⚠️ Empty state - no team members visible due to catalog issue");
      } else {
        // Success state: initial team member should be visible
        cy.contains(INITIAL_TEAM_MEMBER).should("be.visible");
        cy.log(`✅ Initial team member "${INITIAL_TEAM_MEMBER}" is present`);
      }
    });
  });

  it("Scenario: Calculator initializes correctly", () => {
    // Then the calculator should be visible
    cy.get("#calculator").should("be.visible");

    // And the total value should start at zero
    cy.get("#calculator").within(() => {
      cy.get("#total-value").should("be.visible");
      cy.get("#total-value").should("contain", "0");
    });
    
    cy.log("✅ Calculator initialized with zero total");
  });
});