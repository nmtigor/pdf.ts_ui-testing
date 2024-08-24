/** 80**************************************************************************
 * @module build
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
      `'deno run --allow-read --allow-run util/build.ts --tsc "/path_to/TypeScript/bin/tsc"'`,
  );
  Deno.exit(1);
}

const parsedArgs = parseArgs(Deno.args);
const PF_tsc = parsedArgs["tsc"] ??
  resolve(AD_pr, "../typescript/TypeScript/bin/tsc");
// console.log("🚀 ~ PF_tsc:", PF_tsc);
/*64----------------------------------------------------------*/

let success = true;
const build_ = build.bind(undefined, PF_tsc);

success &&= (() => {
  let success = true;
  const preNs = "~DENO,TESTING,CYPRESS";
  if (!build_(AD_fe, preNs, 38)) return false;
  if (
    !run(
      "deno run --allow-read --allow-sys --allow-env --allow-run " +
        `${AD_fe}/util/bundle.ts ${AD_fe}/${D_gp_src}/pdf.worker.js`,
    )
  ) return false;
  if (!build_(AD_cy, preNs, 44)) return false;

  return success;
})();

if (success) {
  console.log(`%cSucceeded!`, "color:green");
  Deno.exit(0);
} else {
  Deno.exit(1);
}
/*80--------------------------------------------------------------------------*/
