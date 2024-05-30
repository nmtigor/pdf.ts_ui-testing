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

### cypress run

- ```bash
  cd /path_to/foo/pdf.ts_ui-testing
  deno run --allow-read --allow-run util/test.ts --tsc "/path_to/TypeScript/bin/tsc"
  ```

### cypress open

- ```bash
  cd /path_to/foo/pdf.ts/src/test
  # Start a local file server
  deno run --allow-net --allow-read --allow-write=../baseurl.mjs test_server.ts
  ```
- ```bash
  cd /path_to/foo/pdf.ts
  /path_to/TypeScript/bin/tsc --preprocessorNames ~DENO,TESTING,CYPRESS
  cd /path_to/foo/pdf.ts_ui-testing
  /path_to/TypeScript/bin/tsc --preprocessorNames ~DENO,TESTING,CYPRESS
  npx cypress open
  ```

### test_slave.html

- ```bash
  cd /path_to/foo/pdf.ts/src/test
  # Start a local file server
  deno run --allow-net --allow-read --allow-write=../baseurl.mjs test_server.ts
  ```
- ```bash
  cd /path_to/foo/pdf.ts
  /path_to/TypeScript/bin/tsc --preprocessorNames ~DENO,TESTING
  ```
- Visit
  <ins>h</ins><ins>ttp://localhost:9071/src/pdf/test_slave.html</ins>

---

### Current States

- Browser: chrome
- Ref tests: 6 / 1037
