/**
 * Feature: Training Plan Cost Calculations
 *
 * As a training planner
 * I want to calculate the cost of my training plan
 * So that I can budget for training realistically
 */

import {
  PLANNER_CONSTANTS,
  extractPriceFromRow,
  getTeamMemberCount,
  generateTrainingPlan,
} from "../../support/plannerUtils";

const SCENARIO_CONFIG = {
  TEAM_COUNT: 5,
  COURSE_POOL_SIZE: 25, // Increased for higher cost calculations
  MIN_SELECTIONS_PER_MEMBER: 1,
  MAX_SELECTIONS_PER_MEMBER: 20, // Increased for higher cost calculations
  INITIAL_BUDGET: 2000, // Reasonable budget for testing
  UPDATED_BUDGET: 3500, // For testing budget editing
  DEFICIT_BUDGET: 50, // Very low budget for deficit testing
  SURPLUS_BUDGET: 50000, // High budget for surplus testing
  BUDGET_TEST_COURSES: 25, // Number of courses for budget testing
  CURRENCY_TOGGLE_TEST_COURSES: 3, // Number of courses to test currency toggle
};

describe("Feature: Training Plan Cost Calculations", () => {
  // Background: Setup planner for each scenario
  beforeEach("Background: Setup planner for calculations", () => {
    // Given I am on the planner page and it has loaded
    cy.visitPlannerAndWait();
  });

  it("Scenario: Budget setup, editing, and deletion", () => {
    // Given I want to set a training budget
    cy.log(`Setting initial budget: ${SCENARIO_CONFIG.INITIAL_BUDGET}`);

    // When I set the budget
    cy.setBudget(SCENARIO_CONFIG.INITIAL_BUDGET);

    // Then the budget should be displayed correctly
    cy.verifyBudget(SCENARIO_CONFIG.INITIAL_BUDGET);

    // And the difference should show the full budget (no costs yet)
    cy.verifyBudgetDifference(SCENARIO_CONFIG.INITIAL_BUDGET);

    // When I edit the budget to a new amount
    cy.log(`Editing budget to: ${SCENARIO_CONFIG.UPDATED_BUDGET}`);
    cy.editBudget(SCENARIO_CONFIG.UPDATED_BUDGET);

    // Then the updated budget should be displayed
    cy.verifyBudget(SCENARIO_CONFIG.UPDATED_BUDGET);
    cy.verifyBudgetDifference(SCENARIO_CONFIG.UPDATED_BUDGET);

    // When I delete the budget
    cy.log("Deleting the budget");
    cy.deleteBudget();

    // Then the budget should no longer be displayed
    cy.get("#calculator").within(() => {
      cy.get("#budget-set").should("be.visible"); // Back to "Set Budget" button
      cy.get("#budget-value").should("not.exist"); // Budget value should be gone
    });

    cy.log("✅ Budget setup, editing, and deletion completed");
  });

  it("Scenario: Comprehensive team and plan calculations", () => {
    // Given I have set a budget and generate a training plan
    cy.setBudget(SCENARIO_CONFIG.INITIAL_BUDGET);

    const trainingPlan = generateTrainingPlan(
      SCENARIO_CONFIG.TEAM_COUNT,
      SCENARIO_CONFIG.COURSE_POOL_SIZE,
      SCENARIO_CONFIG.MIN_SELECTIONS_PER_MEMBER,
      SCENARIO_CONFIG.MAX_SELECTIONS_PER_MEMBER,
    );

    let runningTotal = 0;

    // When I add the required team members
    for (let i = 1; i < SCENARIO_CONFIG.TEAM_COUNT; i++) {
      cy.log(`Adding team member ${i + 1} of ${SCENARIO_CONFIG.TEAM_COUNT}`);
      cy.addTeamMember();
      cy.wait(PLANNER_CONSTANTS.TEAM_ACTION_WAIT);
    }

    // Then I should have the expected number of team members
    getTeamMemberCount().then((finalCount) => {
      expect(finalCount).to.equal(SCENARIO_CONFIG.TEAM_COUNT);
      cy.log(`✅ Team setup complete: ${finalCount} members`);
    });

    // When I make course selections for each team member (in TUs mode)
    trainingPlan.memberSelections.forEach(
      (memberSelections: number[], memberIndex: number) => {
        const columnIndex =
          PLANNER_CONSTANTS.FIRST_TEAM_MEMBER_COLUMN + memberIndex;

        cy.log(
          `Member ${memberIndex + 1}: Selecting ${memberSelections.length} courses: [${memberSelections.join(", ")}]`,
        );

        memberSelections.forEach((rowIndex: number) => {
          // Get price and update running totals
          extractPriceFromRow(rowIndex).then((price) => {
            runningTotal += price;
            const currentBudgetDifference =
              SCENARIO_CONFIG.INITIAL_BUDGET - runningTotal;

            cy.log(
              `Selecting course ${rowIndex} for member ${memberIndex + 1} (price: ${price}, running total: ${runningTotal})`,
            );

            // Make the selection
            cy.selectCourseForMember(rowIndex, columnIndex);
            cy.wait(PLANNER_CONSTANTS.SELECTION_WAIT);

            // Verify calculator shows correct running total (in TUs)
            cy.verifyCalculatorTotal(runningTotal);

            // Verify budget difference updates correctly
            cy.verifyBudgetDifference(currentBudgetDifference);
          });
        });
      },
    );

    // Store final total for logging
    cy.log(
      `✅ Comprehensive selection tracking completed: ${trainingPlan.totalSelections} total selections, final total: ${runningTotal}`,
    );
  });

  it("Scenario: Currency mode toggle", () => {
    // Given I need to test toggle functionality with non-zero costs
    // (No budget needed for this test)

    // Find courses that actually cost money (not free courses)
    let paidCoursesFound = 0;

    // When I search for paid courses and select them
    for (
      let i = 1;
      i <= SCENARIO_CONFIG.COURSE_POOL_SIZE &&
      paidCoursesFound < SCENARIO_CONFIG.CURRENCY_TOGGLE_TEST_COURSES;
      i++
    ) {
      extractPriceFromRow(i).then((price) => {
        if (price > 0) {
          paidCoursesFound++;
          cy.log(
            `Found paid course ${i}: ${price} (total courses found: ${paidCoursesFound})`,
          );
          cy.selectCourseForMember(
            i,
            PLANNER_CONSTANTS.FIRST_TEAM_MEMBER_COLUMN,
          );
          cy.wait(PLANNER_CONSTANTS.SELECTION_WAIT);
        }
      });
    }

    cy.wait(PLANNER_CONSTANTS.CALCULATOR_WAIT);

    // Then I should have a non-zero total to test currency conversion
    cy.get("#calculator #total-value")
      .invoke("text")
      .then((tuTotalText) => {
        const tuAmount = parseInt(tuTotalText.replace(/,/g, ""));

        // Verify we have a meaningful amount to test with
        expect(tuAmount).to.be.greaterThan(0);
        cy.log(`Starting with TUs: ${tuAmount}`);

        // When I toggle to USD mode
        cy.toggleCreditsMode();
        cy.wait(300); // Reduced wait time

        // Then the USD amount should be exactly TUs * 10
        cy.get("#calculator #total-value")
          .invoke("text")
          .then((usdTotalText) => {
            const usdAmount = parseInt(usdTotalText.replace(/,/g, ""));
            const expectedUsdAmount = tuAmount * 10;

            expect(usdAmount).to.equal(expectedUsdAmount);
            cy.log(
              `TUs: ${tuAmount} → USD: ${usdAmount} (${tuAmount} × 10 = ${expectedUsdAmount}) ✓`,
            );

            // When I toggle back to TUs
            cy.toggleCreditsMode();
            cy.wait(300); // Reduced wait time

            // Then I should be back to the original TU amount
            cy.get("#calculator #total-value")
              .invoke("text")
              .then((finalTotalText) => {
                const finalAmount = parseInt(finalTotalText.replace(/,/g, ""));
                expect(finalAmount).to.equal(tuAmount);
                cy.log(
                  "✅ Credits/USD toggle verified - returned to original TU amount",
                );
              });
          });
      });
  });

  it("Scenario: Budget surplus and deficit scenarios with editing", () => {
    // Test deficit scenario first (low budget)
    cy.log(
      `Testing deficit scenario with budget: ${SCENARIO_CONFIG.DEFICIT_BUDGET}`,
    );

    // Given I set a very low budget
    cy.setBudget(SCENARIO_CONFIG.DEFICIT_BUDGET);

    // When I find and select paid courses only
    let paidCoursesSelected = 0;
    let totalCostFromCourses = 0;

    for (
      let i = 1;
      i <= SCENARIO_CONFIG.COURSE_POOL_SIZE &&
      paidCoursesSelected < SCENARIO_CONFIG.BUDGET_TEST_COURSES;
      i++
    ) {
      extractPriceFromRow(i).then((price) => {
        if (price > 0) {
          paidCoursesSelected++;
          totalCostFromCourses += price;
          cy.log(
            `Selected paid course ${i}: ${price} (total courses: ${paidCoursesSelected}, running cost: ${totalCostFromCourses})`,
          );
          cy.selectCourseForMember(
            i,
            PLANNER_CONSTANTS.FIRST_TEAM_MEMBER_COLUMN,
          );
          cy.wait(PLANNER_CONSTANTS.SELECTION_WAIT);
        }
      });
    }

    cy.wait(PLANNER_CONSTANTS.CALCULATOR_WAIT);

    // Then verify calculator total matches our calculated cost
    cy.get("#calculator #total-value")
      .invoke("text")
      .then((calculatorTotalText) => {
        const calculatorTotal = parseInt(calculatorTotalText.replace(/,/g, ""));
        expect(calculatorTotal).to.equal(totalCostFromCourses);
        cy.log(
          `✅ Calculator total (${calculatorTotal}) matches expected cost (${totalCostFromCourses})`,
        );

        // And verify deficit difference is calculated correctly
        const expectedDeficit =
          SCENARIO_CONFIG.DEFICIT_BUDGET - totalCostFromCourses;
        cy.verifyBudgetDifference(expectedDeficit);
        cy.log(
          `✅ Deficit verified: Budget ${SCENARIO_CONFIG.DEFICIT_BUDGET} - Cost ${totalCostFromCourses} = ${expectedDeficit} (negative)`,
        );
      });

    // Test surplus scenario by editing to a high budget (same courses)
    cy.log(
      `Testing surplus scenario by editing budget to: ${SCENARIO_CONFIG.SURPLUS_BUDGET}`,
    );

    // When I edit to a very high budget (keeping same course selections)
    cy.editBudget(SCENARIO_CONFIG.SURPLUS_BUDGET);

    // Then verify the total cost is still the same
    cy.get("#calculator #total-value")
      .invoke("text")
      .then((calculatorTotalText) => {
        const calculatorTotal = parseInt(calculatorTotalText.replace(/,/g, ""));
        expect(calculatorTotal).to.equal(totalCostFromCourses);
        cy.log(
          `✅ Calculator total (${calculatorTotal}) still matches expected cost (${totalCostFromCourses})`,
        );

        // And verify surplus difference is calculated correctly
        const expectedSurplus =
          SCENARIO_CONFIG.SURPLUS_BUDGET - totalCostFromCourses;
        cy.verifyBudgetDifference(expectedSurplus);
        cy.log(
          `✅ Surplus verified: Budget ${SCENARIO_CONFIG.SURPLUS_BUDGET} - Cost ${totalCostFromCourses} = ${expectedSurplus} (positive)`,
        );
      });

    // When I delete the budget entirely
    cy.log("Testing budget deletion with existing selections");
    cy.deleteBudget();

    // Then the calculator total should remain but budget-related fields should be gone
    cy.get("#calculator #total-value")
      .invoke("text")
      .then((calculatorTotalText) => {
        const calculatorTotal = parseInt(calculatorTotalText.replace(/,/g, ""));
        expect(calculatorTotal).to.equal(totalCostFromCourses);
        cy.log(
          `✅ Calculator total preserved after budget deletion: ${calculatorTotal}`,
        );
      });

    // And budget-related elements should be reset
    cy.get("#calculator").within(() => {
      cy.get("#budget-set").should("be.visible"); // Back to "Set Budget" button
      cy.get("#budget-value").should("not.exist"); // Budget value should be gone
      cy.get("#difference-value").should("not.exist"); // Difference should be gone
    });

    cy.log("✅ Budget deletion verified - calculator totals preserved");
  });

  // TODO: unskip eventually, the intention is sound but the logic is broken
  // we need to test budget editing at some point
  it.skip("Scenario: Budget workflow integration with complex plan changes", () => {
    // Given I create a comprehensive budget testing scenario
    cy.log("Testing budget behavior during complex plan modifications");

    // Step 1: Set initial budget and make selections
    cy.setBudget(SCENARIO_CONFIG.INITIAL_BUDGET);

    // Add a team member for more complex testing
    cy.addTeamMember();
    cy.wait(PLANNER_CONSTANTS.TEAM_ACTION_WAIT);

    // Make some initial selections
    cy.selectCourseForMember(1, PLANNER_CONSTANTS.FIRST_TEAM_MEMBER_COLUMN);
    cy.selectCourseForMember(2, PLANNER_CONSTANTS.FIRST_TEAM_MEMBER_COLUMN + 1);
    cy.wait(PLANNER_CONSTANTS.CALCULATOR_WAIT);

    // Capture initial state
    cy.get("#calculator #total-value")
      .invoke("text")
      .then((initialTotalText) => {
        const initialTotal = parseInt(initialTotalText.replace(/,/g, ""));
        const initialDifference = SCENARIO_CONFIG.INITIAL_BUDGET - initialTotal;

        cy.verifyBudgetDifference(initialDifference);
        cy.log(
          `Step 1: Initial total ${initialTotal}, difference ${initialDifference}`,
        );

        // Step 2: Edit budget while maintaining selections
        cy.editBudget(SCENARIO_CONFIG.UPDATED_BUDGET);

        // Then total should remain same but difference should update
        cy.verifyCalculatorTotal(initialTotal);
        const newDifference = SCENARIO_CONFIG.UPDATED_BUDGET - initialTotal;
        cy.verifyBudgetDifference(newDifference);
        cy.log(`Step 2: Budget edited, new difference ${newDifference}`);

        // Step 3: Add more selections and verify budget calculations
        cy.selectCourseForMember(3, PLANNER_CONSTANTS.FIRST_TEAM_MEMBER_COLUMN);
        cy.wait(PLANNER_CONSTANTS.CALCULATOR_WAIT);

        cy.get("#calculator #total-value")
          .invoke("text")
          .then((newTotalText) => {
            const newTotal = parseInt(newTotalText.replace(/,/g, ""));
            const finalDifference = SCENARIO_CONFIG.UPDATED_BUDGET - newTotal;

            expect(newTotal).to.be.greaterThan(initialTotal);
            cy.verifyBudgetDifference(finalDifference);
            cy.log(
              `Step 3: Added selection, total now ${newTotal}, difference ${finalDifference}`,
            );

            // Step 4: Remove a team member and verify budget impact
            cy.removeTeamMember("Erlich Bachman");
            cy.wait(PLANNER_CONSTANTS.TEAM_ACTION_WAIT);

            // Budget and remaining selections should still be calculated correctly
            cy.get("#calculator #total-value")
              .invoke("text")
              .then((finalTotalText) => {
                const finalTotal = parseInt(finalTotalText.replace(/,/g, ""));
                const endDifference =
                  SCENARIO_CONFIG.UPDATED_BUDGET - finalTotal;

                cy.verifyBudgetDifference(endDifference);
                cy.log(
                  `Step 4: Team member removed, final total ${finalTotal}, difference ${endDifference}`,
                );

                cy.log(
                  "✅ Complex budget workflow integration completed successfully",
                );
              });
          });
      });
  });
});
