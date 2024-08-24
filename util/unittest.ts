/** 80**************************************************************************
 * @module unittest
 * @license MIT
 ******************************************************************************/

import { D_cy, D_fe, D_fe_pdf, D_gp_src } from "@fe-src/alias.ts";
import { build, run } from "@fe-util/util.ts";
import { parseArgs } from "@std/cli";
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
  // await using proc = cmd(
  //   `deno run --allow-read --allow-net ` +
  //     `--allow-write=${AD_fe}/src/baseurl.mjs ` +
  //     `${AD_pr}/${D_fe_test}/test_server.ts`,
  // )
  //   .spawn();
  // proc.output();
  // /* Wait for writing "baseurl.mjs" */
  // await wait(500);

  let success = true;
  if (
    !run(
      "deno run --allow-read --allow-run " +
        `${AD_cy}/util/build.ts --tsc ${P_tsc}`,
      78,
    )
  ) return false;

  if (!run(`npx cypress run -s '**/pdf/**/*.u.cy.js' -b chrome`, 250)) {
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
