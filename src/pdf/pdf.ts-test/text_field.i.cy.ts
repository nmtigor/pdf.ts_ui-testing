/** 80**************************************************************************
 * Converted from JavaScript to TypeScript by
 * [nmtigor](https://github.com/nmtigor) @2024
 *
 * @module pdf/pdf.ts-test/text_field.i.cy
 * @license Apache-2.0
 ******************************************************************************/

/* Copyright 2021 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { P_html, queriesFrom } from "@cy-pdf.ts-test/integrationtest_utils.ts";
/*80--------------------------------------------------------------------------*/

describe("Text field", () => {
  describe("Empty text field", () => {
    before(() => {
      cy.visit(`/${P_html}?${queriesFrom("file_pdfjs_form.pdf")}`);
    });

    it.skip("must check that the field is empty although its appearance contains a white space", () => {
      // await Promise.all(
      //   pages.map(async ([browserName, page]) => {
      //     const text = await page.$eval(getSelector("7R"), (el) => el.value);
      //     expect(text).withContext(`In ${browserName}`).toEqual("");
      //   }),
      // );
    });
  });
});
/*80--------------------------------------------------------------------------*/
