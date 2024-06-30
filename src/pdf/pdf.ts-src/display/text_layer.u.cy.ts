/** 80**************************************************************************
 * Converted from JavaScript to TypeScript by
 * [nmtigor](https://github.com/nmtigor) @2024
 *
 * @module pdf/pdf.ts-src/display/text_layer.u.cy
 * @license Apache-2.0
 ******************************************************************************/

/* Copyright 2022 Mozilla Foundation
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

import { buildGetDocumentParams } from "@cy-pdf.ts-test/test_utils.ts";
import { getDocument } from "@fe-pdf.ts-src/display/api.ts";
import { TextLayer } from "@fe-pdf.ts-src/display/text_layer.ts";
/*80--------------------------------------------------------------------------*/

describe("textLayer", () => {
  it("creates textLayer from ReadableStream", async () => {
    await using loadingTask = getDocument(
      buildGetDocumentParams("basicapi.pdf"),
    );
    const pdfDocument = await loadingTask.promise;
    const page = await pdfDocument.getPage(1);

    const textLayer = new TextLayer({
      textContentSource: page.streamTextContent(),
      container: document.createElement("div"),
      viewport: page.getViewport({ scale: 1 }),
    });
    await textLayer.render();

    expect(textLayer.textContentItemsStr).eql([
      "Table Of Content",
      "",
      "Chapter 1",
      " ",
      "..........................................................",
      " ",
      "2",
      "",
      "Paragraph 1.1",
      " ",
      "......................................................",
      " ",
      "3",
      "",
      "page 1 / 3",
    ]);
  });

  it("creates textLayer from TextContent", async () => {
    await using loadingTask = getDocument(
      buildGetDocumentParams("basicapi.pdf"),
    );
    const pdfDocument = await loadingTask.promise;
    const page = await pdfDocument.getPage(1);

    const textLayer = new TextLayer({
      textContentSource: await page.getTextContent(),
      container: document.createElement("div"),
      viewport: page.getViewport({ scale: 1 }),
    });
    await textLayer.render();

    expect(textLayer.textContentItemsStr).eql([
      "Table Of Content",
      "",
      "Chapter 1",
      " ",
      "..........................................................",
      " ",
      "2",
      "",
      "Paragraph 1.1",
      " ",
      "......................................................",
      " ",
      "3",
      "",
      "page 1 / 3",
    ]);
  });
});
/*80--------------------------------------------------------------------------*/
