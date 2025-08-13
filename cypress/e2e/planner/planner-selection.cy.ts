/**
 * Feature: Course Selection in Planner
 * 
 * As a training planner
 * I want to select courses for team members in my training plan
 * So that I can build a comprehensive training curriculum
 */

import {
  PLANNER_CONSTANTS,
  extractPriceFromRow,
} from "../../support/plannerUtils";

const SCENARIO_CONFIG = {
  BASIC_SELECTION_COUNT: 3,
  CALCULATOR_TEST_COUNT: 10,
  DESELECTION_TEST_COUNT: 5,
};

describe("Feature: Course Selection in Planner", () => {
  
  // Background: Setup planner with initial team member
  beforeEach("Background: Setup planner for course selection", () => {
    // Given I am on the planner page and it has loaded
    cy.visitPlannerAndWait();
  });

  it("Scenario: Selecting courses provides visual feedback", () => {
    // Given the calculator starts at zero
    cy.get("#calculator #total-value").should("contain", "0");

    // When I select multiple courses for the initial team member
    for (let i = 1; i <= SCENARIO_CONFIG.BASIC_SELECTION_COUNT; i++) {
      // Then each course row should be visible
      cy.get(`#table-row-${i}`).should("be.visible");

      // And it should start in an unselected state
      cy.verifySelectionState(i, false, PLANNER_CONSTANTS.FIRST_TEAM_MEMBER_COLUMN);

      // When I click to select the course
      cy.selectCourseForMember(i, PLANNER_CONSTANTS.FIRST_TEAM_MEMBER_COLUMN);

      // Then it should show as selected
      cy.verifySelectionState(i, true, PLANNER_CONSTANTS.FIRST_TEAM_MEMBER_COLUMN);
    }

    cy.log(`✅ Successfully selected ${SCENARIO_CONFIG.BASIC_SELECTION_COUNT} courses with proper visual feedback`);
  });

  it("Scenario: Calculator updates with accurate totals", () => {
    // Given I want to test calculator accuracy with multiple courses
    cy.log(`📊 Testing calculator accuracy with ${SCENARIO_CONFIG.CALCULATOR_TEST_COUNT} courses...`);
    
    // When I select courses and track running totals
    let runningTotal = 0;
    let chain = cy.wrap(null);
    
    for (let i = 1; i <= SCENARIO_CONFIG.CALCULATOR_TEST_COUNT; i++) {
      chain = chain.then(() => {
        // When I get the price for this course
        return extractPriceFromRow(i).then((price) => {
          return cy.log(`Course ${i} Price: ${price}`).then(() => {
            // And add it to my running total
            runningTotal += price;
            
            // And select the course
            cy.selectCourseForMember(i, PLANNER_CONSTANTS.FIRST_TEAM_MEMBER_COLUMN);
            cy.wait(PLANNER_CONSTANTS.CALCULATOR_WAIT);
            
            // Then the calculator should show the correct running total
            return cy.get("#calculator #total-value")
              .invoke('text')
              .then((actualText) => {
                const actualAmount = parseInt(actualText.trim());
                
                return cy.log(`Selection ${i}: Expected ${runningTotal}, got ${actualAmount}`).then(() => {
                  expect(actualAmount).to.equal(runningTotal);
                });
              });
          });
        });
      });
    }
    
    // And all courses should remain selected
    chain.then(() => {
      for (let i = 1; i <= SCENARIO_CONFIG.CALCULATOR_TEST_COUNT; i++) {
        cy.verifySelectionState(i, true, PLANNER_CONSTANTS.FIRST_TEAM_MEMBER_COLUMN);
      }
      
      cy.log(`✅ Calculator accurately tracked ${SCENARIO_CONFIG.CALCULATOR_TEST_COUNT} course selections with total: ${runningTotal}`);
    });
  });

  it("Scenario: Course deselection and calculator reset", () => {
    // Given I have made several course selections
    let expectedTotal = 0;
    
    // When I select multiple courses and track the total
    for (let i = 1; i <= SCENARIO_CONFIG.DESELECTION_TEST_COUNT; i++) {
      extractPriceFromRow(i).then((price) => {
        expectedTotal += price;
        cy.selectCourseForMember(i, PLANNER_CONSTANTS.FIRST_TEAM_MEMBER_COLUMN);
        cy.wait(PLANNER_CONSTANTS.SELECTION_WAIT);
        cy.log(`Selected course ${i}, expected total: ${expectedTotal}`);
      });
    }
    
    cy.wait(PLANNER_CONSTANTS.CALCULATOR_WAIT);
    
    // Then verify the total is correct
    cy.get("#calculator #total-value").invoke('text').then((totalText) => {
      const actualTotal = parseInt(totalText.replace(/,/g, ''));
      expect(actualTotal).to.equal(expectedTotal);
      
      // When I deselect courses in reverse order
      for (let i = SCENARIO_CONFIG.DESELECTION_TEST_COUNT; i >= 1; i--) {
        extractPriceFromRow(i).then((price) => {
          expectedTotal -= price;
          
          // Deselect by clicking the same selection again
          cy.selectCourseForMember(i, PLANNER_CONSTANTS.FIRST_TEAM_MEMBER_COLUMN);
          cy.wait(PLANNER_CONSTANTS.SELECTION_WAIT);
          
          // Verify it's now unselected
          cy.verifySelectionState(i, false, PLANNER_CONSTANTS.FIRST_TEAM_MEMBER_COLUMN);
          
          cy.log(`Deselected course ${i}, expected total: ${expectedTotal}`);
        });
      }
    });
    
    cy.wait(PLANNER_CONSTANTS.CALCULATOR_WAIT);
    
    // Then the total should return to zero
    cy.get("#calculator #total-value").invoke('text').then((finalText) => {
      const finalTotal = parseInt(finalText.replace(/,/g, ''));
      expect(finalTotal).to.equal(0);
    });
    
    cy.log("✅ Deselection behavior verified - calculator returned to zero");
  });
});