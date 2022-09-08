// second-home.spec.ts created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

import * as cypress from "cypress";

describe("second home", () => {
  beforeEach(()=>{
    cy.fixture("courses.json").as("coursesJSON");
    cy.server();
    cy.route("/api/courses", "@coursesJSON").as("courses");
    cy.visit("/");
  })
  it("visit page", () => {

    cy.contains("All Courses");
    cy.wait("@courses");
    cy.get("mat-card").should("have.length", 9);
  });

  it("should display the advanced courses", ()=>{
    cy.get(".mat-tab-label").should("have.length",2)
    cy.get(".mat-tab-label").last().click();
    cy.get('.mat-tab-body-active .mat-card-title').its('length').should("be.gt", 1)
    cy.get('.mat-tab-body-active .mat-card-title').first().should("contain", "Angular Security")
  })
});
