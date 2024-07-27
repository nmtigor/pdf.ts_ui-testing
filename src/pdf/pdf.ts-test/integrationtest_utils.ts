/** 80**************************************************************************
 * Ref. [[pdf.js]/test/integration/test_utils.js](https://github.com/mozilla/pdf.js/blob/master/test/integration/test_utils.mjs)
 *
 * @module pdf/pdf.ts-test/integrationtest_utils
 * @license Apache-2.0
 ******************************************************************************/

import { D_rp_pdfs } from "@fe-src/alias.ts";
/*80--------------------------------------------------------------------------*/

export const P_html = "src/pdf/viewer.html";

export function queriesFrom(filename: string, zoom?: number | string) {
  return [
    `file=${`/${D_rp_pdfs}/${filename}#zoom=${zoom ?? "page-fit"}`}`,
  ].join("&");
}
/*80--------------------------------------------------------------------------*/
