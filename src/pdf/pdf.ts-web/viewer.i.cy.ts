/** 80**************************************************************************
 * Converted from JavaScript to TypeScript by
 * [nmtigor](https://github.com/nmtigor) @2024
 *
 * @module pdf/pdf.ts-web/viewer.i.cy
 * @license Apache-2.0
 ******************************************************************************/

/* Copyright 2024 Mozilla Foundation
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

// import {
//   awaitPromise,
//   closePages,
//   createPromise,
//   getSpanRectFromText,
//   loadAndWait,
// } from "./test_utils.mjs";
import { P_html, queriesFrom } from "@cy-pdf.ts-test/integrationtest_utils.ts";
/*80--------------------------------------------------------------------------*/

describe("PDF viewer", () => {
  describe("Zoom origin", () => {
    before(() => {
      // pages = await loadAndWait(
      //   "tracemonkey.pdf",
      //   ".textLayer .endOfContent",
      //   "page-width",
      //   null,
      //   { page: 2 }
      // );
    });

    // async function getTextAt(page, pageNumber, coordX, coordY) {
    //   await page.waitForFunction(
    //     pageNum =>
    //       !document.querySelector(
    //         `.page[data-page-number="${pageNum}"] > .textLayer`
    //       ).hidden,
    //     {},
    //     pageNumber
    //   );
    //   return page.evaluate(
    //     (x, y) => document.elementFromPoint(x, y)?.textContent,
    //     coordX,
    //     coordY
    //   );
    // }

    it.skip("supports specifiying a custom origin", () => {
      // await Promise.all(
      //   pages.map(async ([browserName, page]) => {
      //     // We use this text span of page 2 because:
      //     // - it's in the visible area even when zooming at page-width
      //     // - it's small, so it easily catches if the page moves too much
      //     // - it's in a "random" position: not near the center of the
      //     //   viewport, and not near the borders
      //     const text = "guards";

      //     const rect = await getSpanRectFromText(page, 2, text);
      //     const originX = rect.x + rect.width / 2;
      //     const originY = rect.y + rect.height / 2;

      //     await page.evaluate(
      //       origin => {
      //         window.PDFViewerApplication.pdfViewer.increaseScale({
      //           scaleFactor: 2,
      //           origin,
      //         });
      //       },
      //       [originX, originY]
      //     );
      //     const textAfterZoomIn = await getTextAt(page, 2, originX, originY);
      //     expect(textAfterZoomIn)
      //       .withContext(`In ${browserName}, zoom in`)
      //       .toBe(text);

      //     await page.evaluate(
      //       origin => {
      //         window.PDFViewerApplication.pdfViewer.decreaseScale({
      //           scaleFactor: 0.8,
      //           origin,
      //         });
      //       },
      //       [originX, originY]
      //     );
      //     const textAfterZoomOut = await getTextAt(page, 2, originX, originY);
      //     expect(textAfterZoomOut)
      //       .withContext(`In ${browserName}, zoom out`)
      //       .toBe(text);
      //   })
      // );
    });
  });

  describe("Zoom with the mouse wheel", () => {
    before(() => {
      cy.visit(`/${P_html}?${queriesFrom("empty.pdf", 1000)}`);
    });

    it.skip("must check that we can zoom with the mouse wheel and pressed control key", () => {
      // await Promise.all(
      //   pages.map(async ([browserName, page]) => {
      //     if (browserName === "firefox") {
      //       // Skip this test for Firefox, as it's not working correctly.
      //       // See https://github.com/puppeteer/puppeteer/issues/12093.
      //       // TODO: Remove this check once the issue is resolved.
      //       return;
      //     }
      //     await page.keyboard.down("Control");
      //     let zoom = 10;
      //     const zoomGetter = () =>
      //       page.evaluate(
      //         () => window.PDFViewerApplication.pdfViewer.currentScale
      //       );
      //     while (zoom > 0.1) {
      //       await page.mouse.wheel({ deltaY: 100 });
      //       zoom = await zoomGetter();
      //     }
      //     while (zoom < 10) {
      //       await page.mouse.wheel({ deltaY: -100 });
      //       zoom = await zoomGetter();
      //     }
      //     await page.keyboard.up("Control");
      //   })
      // );
    });
  });

  describe("Zoom commands", () => {
    before(() => {
      cy.visit(`/${P_html}?${queriesFrom("tracemonkey.pdf")}`);
    });

    it.skip("must check that zoom commands don't scroll the document", () => {
      // await Promise.all(
      //   pages.map(async ([browserName, page]) => {
      //     for (let i = 0; i < 10; i++) {
      //       await page.evaluate(() => window.PDFViewerApplication.zoomIn());
      //       await page.evaluate(() => window.PDFViewerApplication.zoomReset());
      //       await page.waitForSelector(
      //         `.page[data-page-number="1"] .textLayer .endOfContent`
      //       );
      //       const scrollTop = await page.evaluate(
      //         () => document.getElementById("viewerContainer").scrollTop
      //       );
      //       expect(scrollTop < 100)
      //         .withContext(`In ${browserName}`)
      //         .toBe(true);
      //     }
      //   })
      // );
    });
  });

  describe("CSS-only zoom", () => {
    // function createPromiseForFirstPageRendered(page) {
    //   return createPromise(page, (resolve, reject) => {
    //     const controller = new AbortController();
    //     window.PDFViewerApplication.eventBus.on(
    //       "pagerendered",
    //       ({ pageNumber, timestamp }) => {
    //         if (pageNumber === 1) {
    //           resolve(timestamp);
    //           controller.abort();
    //         }
    //       },
    //       { signal: controller.signal }
    //     );
    //     setTimeout(reject, 1000, new Error("Timeout"));
    //   });
    // }

    describe("forced (maxCanvasPixels: 0)", () => {
      before(() => {
        // pages = await loadAndWait(
        //   "tracemonkey.pdf",
        //   ".textLayer .endOfContent",
        //   null,
        //   null,
        //   { maxCanvasPixels: 0 },
        // );
      });

      it.skip("respects drawing delay when zooming out", () => {
        // await Promise.all(
        //   pages.map(async ([browserName, page]) => {
        //     const promise = await createPromiseForFirstPageRendered(page);

        //     const start = await page.evaluate(() => {
        //       const startTime = performance.now();
        //       window.PDFViewerApplication.pdfViewer.decreaseScale({
        //         drawingDelay: 100,
        //         scaleFactor: 0.9,
        //       });
        //       return startTime;
        //     });

        //     const end = await awaitPromise(promise);

        //     expect(end - start)
        //       .withContext(`In ${browserName}`)
        //       .toBeGreaterThanOrEqual(100);
        //   })
        // );
      });

      it.skip("respects drawing delay when zooming in", () => {
        // await Promise.all(
        //   pages.map(async ([browserName, page]) => {
        //     const promise = await createPromiseForFirstPageRendered(page);

        //     const start = await page.evaluate(() => {
        //       const startTime = performance.now();
        //       window.PDFViewerApplication.pdfViewer.increaseScale({
        //         drawingDelay: 100,
        //         scaleFactor: 1.1,
        //       });
        //       return startTime;
        //     });

        //     const end = await awaitPromise(promise);

        //     expect(end - start)
        //       .withContext(`In ${browserName}`)
        //       .toBeGreaterThanOrEqual(100);
        //   })
        // );
      });
    });

    describe("triggers when going bigger than maxCanvasPixels", () => {
      const MAX_CANVAS_PIXELS = new Map();

      before(() => {
        // pages = await loadAndWait(
        //   "tracemonkey.pdf",
        //   ".textLayer .endOfContent",
        //   null,
        //   null,
        //   async (page, browserName) => {
        //     const ratio = await page.evaluate(() => window.devicePixelRatio);
        //     const maxCanvasPixels = 1_000_000 * ratio ** 2;
        //     MAX_CANVAS_PIXELS.set(browserName, maxCanvasPixels);

        //     return { maxCanvasPixels };
        //   }
        // );
      });

      beforeEach(() => {
        // await Promise.all(
        //   pages.map(async ([browserName, page]) => {
        //     await page.evaluate(() => {
        //       window.PDFViewerApplication.pdfViewer.currentScale = 0.5;
        //     });
        //   }),
        // );
      });

      // function getCanvasSize(page) {
      //   return page.evaluate(() => {
      //     const canvas = window.document.querySelector(".canvasWrapper canvas");
      //     return canvas.width * canvas.height;
      //   });
      // }

      // MAX_CANVAS_PIXELS must be big enough that the originally rendered
      // canvas still has enough space to grow before triggering CSS-only zoom
      it.skip("test correctly configured", () => {
        // await Promise.all(
        //   pages.map(async ([browserName, page]) => {
        //     const canvasSize = await getCanvasSize(page);

        //     expect(canvasSize)
        //       .withContext(`In ${browserName}`)
        //       .toBeLessThan(MAX_CANVAS_PIXELS.get(browserName) / 4);
        //     expect(canvasSize)
        //       .withContext(`In ${browserName}`)
        //       .toBeGreaterThan(MAX_CANVAS_PIXELS.get(browserName) / 16);
        //   })
        // );
      });

      it.skip("does not trigger CSS-only zoom below maxCanvasPixels", () => {
        // await Promise.all(
        //   pages.map(async ([browserName, page]) => {
        //     const originalCanvasSize = await getCanvasSize(page);
        //     const factor = 2;

        //     await page.evaluate(scaleFactor => {
        //       window.PDFViewerApplication.pdfViewer.increaseScale({
        //         drawingDelay: 0,
        //         scaleFactor,
        //       });
        //     }, factor);

        //     const canvasSize = await getCanvasSize(page);

        //     expect(canvasSize)
        //       .withContext(`In ${browserName}`)
        //       .toBe(originalCanvasSize * factor ** 2);

        //     expect(canvasSize)
        //       .withContext(`In ${browserName}, MAX_CANVAS_PIXELS`)
        //       .toBeLessThan(MAX_CANVAS_PIXELS.get(browserName));
        //   })
        // );
      });

      it.skip("triggers CSS-only zoom above maxCanvasPixels", () => {
        // await Promise.all(
        //   pages.map(async ([browserName, page]) => {
        //     const originalCanvasSize = await getCanvasSize(page);
        //     const factor = 4;

        //     await page.evaluate(scaleFactor => {
        //       window.PDFViewerApplication.pdfViewer.increaseScale({
        //         drawingDelay: 0,
        //         scaleFactor,
        //       });
        //     }, factor);

        //     const canvasSize = await getCanvasSize(page);

        //     expect(canvasSize)
        //       .withContext(`In ${browserName}`)
        //       .toBeLessThan(originalCanvasSize * factor ** 2);

        //     expect(canvasSize)
        //       .withContext(`In ${browserName}, <= MAX_CANVAS_PIXELS`)
        //       .toBeLessThanOrEqual(MAX_CANVAS_PIXELS.get(browserName));

        //     expect(canvasSize)
        //       .withContext(`In ${browserName}, > MAX_CANVAS_PIXELS * 0.99`)
        //       .toBeGreaterThan(MAX_CANVAS_PIXELS.get(browserName) * 0.99);
        //   })
        // );
      });
    });
  });
});
/*80--------------------------------------------------------------------------*/
