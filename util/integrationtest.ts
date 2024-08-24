/** 80**************************************************************************
 * Integration test for pdf.ts
 *
 * @module integrationtest
 * @license MIT
 ******************************************************************************/

import { D_cy } from "@fe-src/alias.ts";
import { run } from "@fe-util/util.ts";
import { parseArgs } from "@std/cli";
import { resolve } from "@std/path";
/*80--------------------------------------------------------------------------*/

const AD_pr = resolve(new URL(Deno.mainModule).pathname, "../../..");
// console.log("🚀 ~ AD_pr:", AD_pr)
const AD_cy = `${AD_pr}/${D_cy}`;
if (AD_cy !== Deno.cwd()) {
  /* Needed by `npx cypress run` */
  console.log(
    `Please path to "${AD_cy}", and run ` +
      `'deno run --allow-read --allow-run util/integrationtest.ts --tsc "/path_to/TypeScript/bin/tsc"'`,
  );
  Deno.exit(1);
}

const parsedArgs = parseArgs(Deno.args);
const P_tsc = parsedArgs["tsc"] ??
  resolve(AD_pr, "../typescript/TypeScript/bin/tsc");
// console.log("🚀 ~ P_tsc:", P_tsc);
/*64----------------------------------------------------------*/

let success = true;

success &&= (() => {
  let success = true;
  if (
    !run(
      "deno run --allow-read --allow-run " +
        `${AD_cy}/util/build.ts --tsc ${P_tsc}`,
      78,
    )
  ) return false;

  if (!run(`npx cypress run -s '**/pdf/**/*.i.cy.js' -b chrome`, 354)) {
    success = false;
  }

  return success;
})();

if (success) {
  console.log(`%cSucceeded!`, "color:green");
  Deno.exit(0);
} else {
  Deno.exit(1);
}
/*80--------------------------------------------------------------------------*/
