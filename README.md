UI testing part is separated from [pdf.ts](https://github.com/nmtigor/pdf.ts) to
this project.

[Cypress](https://www.cypress.io/) is used to do UI testing.

---

- Extract [@mymain](https://github.com/nmtigor/TypeScript) onto
  <ins>/path_to/TypeScript</ins>
- ```bash
  cd /path_to/TypeScript
  npm i
  hereby LKG
  ```
- Extract [pdf.ts](https://github.com/nmtigor/pdf.ts) onto
  <ins>/path_to/foo/pdf.ts</ins>
- Extract this project onto <ins>/path_to/foo/pdf.ts_ui-testing</ins>
- ```bash
  cd /path_to/foo/pdf.ts_ui-testing
  npm i
  ```

"pdf.ts" and "pdf.ts_ui-testing" MUST be in the same folder. Name "foo" is
irrelevant.

### unittest

- ```bash
  cd /path_to/pdf.ts/src/test
  deno task server
  ```
- ```bash
  cd /path_to/foo/pdf.ts_ui-testing
  deno run --allow-read --allow-run util/unittest.ts --tsc "/path_to/TypeScript/bin/tsc"
  ```

### reftest

- Extract [pdf.js-4.3.136](https://github.com/mozilla/pdf.js/tree/v4.3.136) onto
  <ins>/path_to/pdf.js</ins>, and run `gulp makeref` there.
- ```bash
  ln -f -s /path_to/pdf.js/test/tmp /path_to/foo/pdf.ts/res/pdf/test/ref 
  cd /path_to/foo/pdf.ts/src/test
  deno task pdfref
  ```
- ```bash
  cd /path_to/foo/pdf.ts_ui-testing
  deno run --allow-read --allow-run util/build.ts --tsc "/path_to/TypeScript/bin/tsc"
  ```
- Visit
  <ins>h</ins><ins>ttp://localhost:8051/src/pdf/pdf.ts-test/test_slave.html</ins>
  in chrome or edge\
  (DO NOT zoom page)

### cypress open

- ```bash
  cd /path_to/foo/pdf.ts/src/test
  deno task server
  ```
- ```bash
  cd /path_to/foo/pdf.ts_ui-testing
  deno run --allow-read --allow-run util/build.ts --tsc "/path_to/TypeScript/bin/tsc"
  npx cypress open
  ```

---

### Current States

- Browser: chrome
- unittest: 28 / 38
- reftest: 3 / 1061
