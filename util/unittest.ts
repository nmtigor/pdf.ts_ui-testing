/** 80**************************************************************************
 * @module unittest
 * @license MIT
 ******************************************************************************/

import { D_cy, D_fe } from "@fe-src/alias.ts";
import { build, run } from "@fe-util/util.ts";
import { parseArgs } from "@std/cli/parse_args.ts";
import { resolve } from "@std/path";
/*80--------------------------------------------------------------------------*/

const AD_pr = resolve(new URL(Deno.mainModule).pathname, "../../..");
// console.log("🚀 ~ AD_pr:", AD_pr)
const AD_fe = `${AD_pr}/${D_fe}`;
const AD_cy = `${AD_pr}/${D_cy}`;
if (AD_cy !== Deno.cwd()) {
  /* Needed by `npx cypress run` */
  console.log(
    `Please path to "${AD_cy}", and run ` +
      `'deno run --allow-read --allow-run util/unittest.ts --tsc "/path_to/TypeScript/bin/tsc"'`,
  );
  Deno.exit(1);
}

const parsedArgs = parseArgs(Deno.args);
const P_tsc = parsedArgs["tsc"] ??
  resolve(AD_pr, "../typescript/TypeScript/bin/tsc");
// console.log("🚀 ~ P_tsc:", P_tsc);
/*64----------------------------------------------------------*/

let success = true;
const build_ = build.bind(undefined, P_tsc);

success &&= (() => {
  let success = true;
  const preNs = "~DENO,TESTING,CYPRESS";
  if (!build_(AD_fe, preNs, 19)) return false;
  if (!build_(AD_cy, preNs, 25)) return false;

  if (!run(`npx cypress run -s **/pdf/**/*.u.cy.js -b chrome`, 126)) {
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
