/** 80**************************************************************************
 * @module pdf/pdf.ts-test/slave.cy
 * @license Apache-2.0
 ******************************************************************************/

import { D_sp_test } from "@fe-src/alias.ts";
import { MOZCENTRAL } from "@fe-src/global.ts";
/*80--------------------------------------------------------------------------*/

it("slave", { viewportWidth: 1440, viewportHeight: 900 }, () => {
  /*#static*/ if (MOZCENTRAL) {
    cy.visit(
      `/${D_sp_test}/test_slave.html` + [
        "?browser=firefox",
      ].join("&"),
    );
  } else {
    cy.visit(
      `/${D_sp_test}/test_slave.html` + [
        "?browser=chrome",
      ].join("&"),
    );
  }
});
/*80--------------------------------------------------------------------------*/
