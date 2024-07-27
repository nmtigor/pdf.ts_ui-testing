/** 80**************************************************************************
 * Converted from JavaScript to TypeScript by
 * [nmtigor](https://github.com/nmtigor) @2024
 *
 * @module pdf/pdf.ts-test/accessibility.i.cy
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

describe("accessibility", () => {
  describe("structure tree", () => {
    before(() => {
      cy.visit(`/${P_html}?${queriesFrom("structure_simple.pdf")}`);
    });

    it.skip("must build structure that maps to text layer", () => {
      // await Promise.all(
      //   pages.map(async ([browserName, page]) => {
      //     await page.waitForSelector(".structTree");
      //     const isVisible = await page.evaluate(() => {
      //       let elem = document.querySelector(".structTree");
      //       while (elem) {
      //         if (elem.getAttribute("aria-hidden") === "true") {
      //           return false;
      //         }
      //         elem = elem.parentElement;
      //       }
      //       return true;
      //     });

      //     expect(isVisible).withContext(`In ${browserName}`).toBeTrue();

      //     // Check the headings match up.
      //     const head1 = await page.$eval(
      //       ".structTree [role='heading'][aria-level='1'] span",
      //       (el) =>
      //         document.getElementById(el.getAttribute("aria-owns")).textContent,
      //     );
      //     expect(head1).withContext(`In ${browserName}`).toEqual("Heading 1");
      //     const head2 = await page.$eval(
      //       ".structTree [role='heading'][aria-level='2'] span",
      //       (el) =>
      //         document.getElementById(el.getAttribute("aria-owns")).textContent,
      //     );
      //     expect(head2).withContext(`In ${browserName}`).toEqual("Heading 2");

      //     // Check the order of the content.
      //     const texts = await page.$$eval(
      //       ".structTree [aria-owns]",
      //       (nodes) =>
      //         nodes.map(
      //           (el) =>
      //             document.getElementById(el.getAttribute("aria-owns"))
      //               .textContent,
      //         ),
      //     );
      //     expect(texts)
      //       .withContext(`In ${browserName}`)
      //       .toEqual([
      //         "Heading 1",
      //         "This paragraph 1.",
      //         "Heading 2",
      //         "This paragraph 2.",
      //       ]);
      //   }),
      // );
    });
  });

  describe("Annotation", () => {
    before(() => {
      cy.visit(`/${P_html}?${queriesFrom("tracemonkey_a11y.pdf")}`);
    });

    // function getSpans(page) {
    //   return page.evaluate(() => {
    //     const elements = document.querySelectorAll(
    //       `.textLayer span[aria-owns]:not([role="presentation"])`,
    //     );
    //     const results = [];
    //     for (const element of elements) {
    //       results.push(element.innerText);
    //     }
    //     return results;
    //   });
    // }

    it.skip("must check that some spans are linked to some annotations thanks to aria-owns", () => {
      // await Promise.all(
      //   pages.map(async ([browserName, page]) => {
      //     const spanContents = await getSpans(page);

      //     expect(spanContents)
      //       .withContext(`In ${browserName}`)
      //       .toEqual(["Languages", "@intel.com", "Abstract", "Introduction"]);
      //   }),
      // );
    });
  });

  describe("Annotations order", () => {
    before(() => {
      cy.visit(`/${P_html}?${queriesFrom("fields_order.pdf")}`);
    });

    it("must check that the text fields are in the visual order", () => {
      const results: string[] = [];
      cy.get(".annotationLayer .textWidgetAnnotation")
        .each((jel) => {
          results.push(jel[0].getAttribute("data-annotation-id")!);
        });
      cy.wrap(results)
        .should("eql", ["32R", "30R", "31R", "34R", "29R", "33R"]);
    });
  });

  describe("Stamp annotation accessibility", () => {
    before(() => {
      cy.visit(`/${P_html}?${queriesFrom("tagged_stamp.pdf")}`);
    });

    it.skip("must check the id in aria-controls", () => {
      // await Promise.all(
      //   pages.map(async ([browserName, page]) => {
      //     await page.waitForSelector(".annotationLayer");
      //     const stampId = "pdfjs_internal_id_20R";
      //     await page.click(`#${stampId}`);

      //     const controlledId = await page.$eval(
      //       "#pdfjs_internal_id_21R",
      //       (el) =>
      //         document.getElementById(el.getAttribute("aria-controls")).id,
      //     );
      //     expect(controlledId)
      //       .withContext(`In ${browserName}`)
      //       .toEqual(stampId);
      //   }),
      // );
    });

    it.skip("must check the aria-label linked to the stamp annotation", () => {
      // await Promise.all(
      //   pages.map(async ([browserName, page]) => {
      //     await page.waitForSelector(".structTree");

      //     const ariaLabel = await page.$eval(
      //       ".structTree [role='figure']",
      //       (el) => el.getAttribute("aria-label"),
      //     );
      //     expect(ariaLabel)
      //       .withContext(`In ${browserName}`)
      //       .toEqual("Secondary text for stamp");
      //   }),
      // );
    });

    it.skip("must check that the stamp annotation is linked to the struct tree", () => {
      // await Promise.all(
      //   pages.map(async ([browserName, page]) => {
      //     await page.waitForSelector(".structTree");

      //     const isLinkedToStampAnnotation = await page.$eval(
      //       ".structTree [role='figure']",
      //       (el) =>
      //         document
      //           .getElementById(el.getAttribute("aria-owns"))
      //           .classList.contains("stampAnnotation"),
      //     );
      //     expect(isLinkedToStampAnnotation)
      //       .withContext(`In ${browserName}`)
      //       .toEqual(true);
      //   }),
      // );
    });
  });
});
/*80--------------------------------------------------------------------------*/
