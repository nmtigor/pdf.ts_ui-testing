/** 80**************************************************************************
 * @module test
 * @license MIT
 ******************************************************************************/

import { wait } from "@fe-lib/util/general.ts";
import { build, cmd, run } from "@fe-util/util.ts";
import { parseArgs } from "@std/cli/parse_args.ts";
import { relative, resolve } from "@std/path/mod.ts";
/*80--------------------------------------------------------------------------*/

const AD_pr = resolve(new URL(Deno.mainModule).pathname, "../../..");
// console.log("🚀 ~ AD_pr:", AD_pr)
const D_fe = "pdf.ts", AD_fe = `${AD_pr}/${D_fe}`;
const D_cy = `${D_fe}_ui-testing`, AD_cy = `${AD_pr}/${D_cy}`;
if (AD_cy !== Deno.cwd()) {
  /* Needed by `npx cypress run` */
  console.log(
    `Please path to "${AD_cy}", and run 'deno run --allow-read --allow-run util/test.ts --tsc "/path_to/TypeScript/bin/tsc"'`,
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

success &&= await (async () => {
  await using proc = cmd(
    `deno run --allow-read --allow-net --allow-write=${
      relative(AD_cy, `${AD_fe}/src/baseurl.mjs`)
    } ${AD_fe}/src/test/test_server.ts`,
  )
    .spawn();
  proc.output();
  /* Wait for writing "baseurl.mjs" */
  await wait(500);

  let success = true;
  const preNs = "~DENO,TESTING,CYPRESS";
  if (!build_(AD_fe, preNs, 34)) return false;
  if (!build_(AD_cy, preNs, 26)) return false;

  if (!run(`npx cypress run -b chrome`, 11)) success = false;

  return success;
})();

if (success) {
  console.log(`%cSucceeded!`, "color:green");
  Deno.exit(0);
} else {
  Deno.exit(1);
}
/*80--------------------------------------------------------------------------*/
