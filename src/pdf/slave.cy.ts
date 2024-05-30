/** 80**************************************************************************
 * @module pdf/slave.cy
 * @license Apache-2.0
 ******************************************************************************/

export {};
/*80--------------------------------------------------------------------------*/

const D_test = "src/pdf/pdf.ts-test";

it("slave", { viewportWidth: 1440, viewportHeight: 900 }, () => {
  cy.visit(
    "/src/pdf/test_slave.html" + [
      "?browser=chrome",
      `manifestFile=${encodeURIComponent(`/${D_test}/test_manifest.json`)}`,
      `filterFile=${encodeURIComponent(`/${D_test}/test_filter.json`)}`,
    ].join("&"),
  );
});
/*80--------------------------------------------------------------------------*/
