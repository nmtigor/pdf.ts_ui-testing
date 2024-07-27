/** 80**************************************************************************
 * @module /cypress/support/index
 * @license Apache-2.0
 ******************************************************************************/

export {};
/*80--------------------------------------------------------------------------*/

declare global {
  namespace Cypress {
    interface Chainable {
      /** */
      take(selector_x: string, ...args: any[]): Chainable<JQuery<HTMLElement>>;

      /** */
      disabled(): void;
      /** */
      enabled(): void;

      /** */
      childrenEqual(...children_cy_x: Chainable<JQuery<HTMLElement>>[]): void;
    }
  }
}

Cypress.Commands.add("take", (selector_x, ...args) => {
  return cy.get(`[data-cy="${selector_x}"]`, ...args);
});

Cypress.Commands.add("disabled", { prevSubject: "element" }, (subj_x) => {
  // Cypress will wait a few seconds if it does not hold instantaneously
  cy.wrap(subj_x[0].firstChild).should("have.css", "opacity", "0.38");
});
Cypress.Commands.add("enabled", { prevSubject: "element" }, (subj_x) => {
  // Cypress will wait a few seconds if it does not hold instantaneously
  cy.wrap(subj_x[0].firstChild).should("have.css", "opacity", "1");
});

Cypress.Commands.add(
  "childrenEqual",
  { prevSubject: "element" },
  (subj_x, ...children_cy_x) => {
    const LEN = children_cy_x.length;
    const expect_a = subj_x[0].children;
    expect(expect_a.length).eq(LEN);
    // assert(expect_a.length === LEN);
    for (let i = 0; i < LEN; ++i) {
      children_cy_x[i].then((_z) => {
        // console.log("🚀 ~ i:", i);
        // console.log(expect_a.item(i));
        // console.log(_z[0]);
        expect(expect_a.item(i)).equal(_z[0]);
      });
    }
  },
);
/*80--------------------------------------------------------------------------*/
