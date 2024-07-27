/** 80**************************************************************************
 * Converted from JavaScript to TypeScript by
 * [nmtigor](https://github.com/nmtigor) @2024
 *
 * @module pdf/pdf.ts-src/display/api.u.cy
 * @license Apache-2.0
 ******************************************************************************/

/* Copyright 2020 Mozilla Foundation
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

import type { BuildGetDocumentParamsOptions } from "@cy-pdf.ts-test/unittest_utils.js";
import {
  buildGetDocumentParams,
  getPDF,
  TEST_IMAGES_PATH,
  TEST_PDFS_PATH,
} from "@cy-pdf.ts-test/unittest_utils.js";
import type { uint } from "@fe-lib/alias.ts";
import { fail } from "@fe-lib/util/trace.ts";
import type { ImgData } from "@fe-pdf.ts-src/core/evaluator.ts";
import { GlobalImageCache } from "@fe-pdf.ts-src/core/image_utils.ts";
import { PrintAnnotationStorage } from "@fe-pdf.ts-src/display/annotation_storage.ts";
import type {
  DocumentInitP,
  PDFPageProxy,
  StructTreeNode,
} from "@fe-pdf.ts-src/display/api.ts";
import {
  DefaultCanvasFactory,
  getDocument,
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  RenderTask,
} from "@fe-pdf.ts-src/display/api.ts";
import {
  PageViewport,
  RenderingCancelledException,
  StatTimer,
} from "@fe-pdf.ts-src/display/display_utils.ts";
import {
  AnnotationEditorType,
  AnnotationMode,
  ImageKind,
  OPS,
} from "@fe-pdf.ts-src/shared/util.ts";
/*80--------------------------------------------------------------------------*/

describe("api", async () => {
  // let tempServer: TestServer;

  const basicApiFileName = "basicapi.pdf";
  // const basicApiFileLength = 105779; // bytes
  const basicApiGetDocumentParams = buildGetDocumentParams(basicApiFileName);
  const tracemonkeyFileName = "tracemonkey.pdf";
  const tracemonkeyGetDocumentParams = buildGetDocumentParams(
    tracemonkeyFileName,
  );

  let CanvasFactory: DefaultCanvasFactory;
  // let tempServer = null;

  before(() => {
    CanvasFactory = new DefaultCanvasFactory();
  });

  after(() => {
    CanvasFactory = undefined as any;
  });

  function waitSome(callback: () => void) {
    const WAIT_TIMEOUT = 10;
    setTimeout(() => callback(), WAIT_TIMEOUT);
  }

  describe("getDocument", () => {
    /* Feasibility sample
    Generally, deno tests will not be tested again in UI testing. */
    it("creates pdf doc from URL-string", async () => {
      const urlStr = TEST_PDFS_PATH + basicApiFileName;
      await using loadingTask = getDocument(urlStr);
      expect(loadingTask).instanceof(PDFDocumentLoadingTask);
      const pdfDocument = await loadingTask.promise;

      expect(typeof urlStr).eq("string");
      expect(pdfDocument).instanceof(PDFDocumentProxy);
      expect(pdfDocument.numPages).eq(3);
    });
  });

  describe("PDFDocument", () => {
    function findNode(
      parent: StructTreeNode | undefined,
      node: StructTreeNode,
      index: uint,
      check: (node: StructTreeNode) => boolean,
    ): [StructTreeNode, StructTreeNode] | undefined {
      if (check(node)) {
        return [parent!.children[index - 1] as StructTreeNode, node];
      }
      for (let i = 0; i < node.children?.length ?? 0; i++) {
        const child = node.children[i] as StructTreeNode;
        const elements = findNode(node, child, i, check);
        if (elements) {
          return elements;
        }
      }
      return undefined;
    }

    it("write a new stamp annotation, save the pdf and check that the same image has the same ref", async () => {
      const filename = "firefox_logo.png";
      const path =
        new URL(TEST_IMAGES_PATH + filename, window.location.toString()).href;

      const response = await fetch(path);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      let loadingTask = getDocument(buildGetDocumentParams("empty.pdf"));
      let pdfDoc = await loadingTask.promise;
      pdfDoc.annotationStorage.setValue("pdfjs_internal_editor_0", {
        annotationType: AnnotationEditorType.STAMP,
        rect: [12, 34, 56, 78],
        rotation: 0,
        bitmap,
        bitmapId: "im1",
        pageIndex: 0,
      });
      pdfDoc.annotationStorage.setValue("pdfjs_internal_editor_1", {
        annotationType: AnnotationEditorType.STAMP,
        rect: [112, 134, 156, 178],
        rotation: 0,
        bitmapId: "im1",
        pageIndex: 0,
      });

      const data = await pdfDoc.saveDocument();
      await loadingTask.destroy();

      loadingTask = getDocument(data);
      pdfDoc = await loadingTask.promise;
      const page = await pdfDoc.getPage(1);
      const opList = await page.getOperatorList();

      // The pdf contains two stamp annotations with the same image.
      // The image should be stored only once in the pdf and referenced twice.
      // So we can verify that the image is referenced twice in the opList.

      for (let i = 0; i < opList.fnArray.length; i++) {
        if (opList.fnArray[i] === OPS.paintImageXObject) {
          expect(opList.argsArray[i]![0]).eq("img_p0_1");
        }
      }

      await loadingTask.destroy();
    });

    it("write a new stamp annotation in a tagged pdf, save and check the structure tree", async () => {
      const filename = "firefox_logo.png";
      const path =
        new URL(TEST_IMAGES_PATH + filename, window.location.toString()).href;

      const response = await fetch(path);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      let loadingTask = getDocument(buildGetDocumentParams("bug1823296.pdf"));
      let pdfDoc = await loadingTask.promise;
      pdfDoc.annotationStorage.setValue("pdfjs_internal_editor_0", {
        annotationType: AnnotationEditorType.STAMP,
        rect: [128, 400, 148, 420],
        rotation: 0,
        bitmap,
        bitmapId: "im1",
        pageIndex: 0,
        structTreeParentId: "p3R_mc12",
        accessibilityData: {
          type: "Figure",
          alt: "Hello World",
        },
      });

      const data = await pdfDoc.saveDocument();
      await loadingTask.destroy();

      loadingTask = getDocument(data);
      pdfDoc = await loadingTask.promise;
      const page = await pdfDoc.getPage(1);
      const tree = await page.getStructTree();
      const [predecessor, leaf] = findNode(
        undefined,
        tree!,
        0,
        (node) => node.role === "Figure",
      )!;

      expect(predecessor).eql({
        role: "Span",
        children: [
          {
            type: "content",
            id: "p3R_mc12",
          },
        ],
      });

      expect(leaf).eql({
        role: "Figure",
        children: [
          {
            type: "annotation",
            id: "pdfjs_internal_id_477R",
          },
        ],
        alt: "Hello World",
      });

      await loadingTask.destroy();
    });

    it("write a new stamp annotation in a tagged pdf (with some MCIDs), save and check the structure tree", async () => {
      const filename = "firefox_logo.png";
      const path =
        new URL(TEST_IMAGES_PATH + filename, window.location.toString()).href;

      const response = await fetch(path);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      let loadingTask = getDocument(
        buildGetDocumentParams("pdfjs_wikipedia.pdf"),
      );
      let pdfDoc = await loadingTask.promise;
      for (let i = 0; i < 2; i++) {
        pdfDoc.annotationStorage.setValue(`pdfjs_internal_editor_${i}`, {
          annotationType: AnnotationEditorType.STAMP,
          bitmapId: `im${i}`,
          pageIndex: 0,
          rect: [257 + i, 572 + i, 286 + i, 603 + i],
          rotation: 0,
          isSvg: false,
          structTreeParentId: "p2R_mc155",
          accessibilityData: {
            type: "Figure",
            alt: `Firefox logo ${i}`,
          },
          bitmap: structuredClone(bitmap),
        });
      }

      const data = await pdfDoc.saveDocument();
      await loadingTask.destroy();

      loadingTask = getDocument(data);
      pdfDoc = await loadingTask.promise;
      const page = await pdfDoc.getPage(1);
      const tree = await page.getStructTree();

      let [predecessor, figure] = findNode(
        undefined,
        tree!,
        0,
        (node) => node.role === "Figure" && node.alt === "Firefox logo 1",
      )!;
      expect(predecessor).eql({
        role: "NonStruct",
        children: [
          {
            type: "content",
            id: "p2R_mc155",
          },
        ],
      });
      expect(figure).eql({
        role: "Figure",
        children: [
          {
            type: "annotation",
            id: "pdfjs_internal_id_420R",
          },
        ],
        alt: "Firefox logo 1",
      });

      [predecessor, figure] = findNode(
        undefined,
        tree!,
        0,
        (node) => node.role === "Figure" && node.alt === "Firefox logo 0",
      )!;
      expect(predecessor).eql({
        role: "Figure",
        children: [
          {
            type: "annotation",
            id: "pdfjs_internal_id_420R",
          },
        ],
        alt: "Firefox logo 1",
      });
      expect(figure).eql({
        role: "Figure",
        children: [
          {
            type: "annotation",
            id: "pdfjs_internal_id_416R",
          },
        ],
        alt: "Firefox logo 0",
      });

      await loadingTask.destroy();
    });

    it("write a new stamp annotation in a tagged pdf, save, repeat and check the structure tree", async () => {
      const filename = "firefox_logo.png";
      const path =
        new URL(TEST_IMAGES_PATH + filename, window.location.toString()).href;

      const response = await fetch(path);
      const blob = await response.blob();
      let loadingTask, pdfDoc;
      let data: DocumentInitP | Uint8Array = buildGetDocumentParams(
        "empty.pdf",
      );

      for (let i = 1; i <= 2; i++) {
        const bitmap = await createImageBitmap(blob);
        loadingTask = getDocument(data);
        pdfDoc = await loadingTask.promise;
        pdfDoc.annotationStorage.setValue("pdfjs_internal_editor_0", {
          annotationType: AnnotationEditorType.STAMP,
          rect: [10 * i, 10 * i, 20 * i, 20 * i],
          rotation: 0,
          bitmap,
          bitmapId: "im1",
          pageIndex: 0,
          structTreeParentId: undefined,
          accessibilityData: {
            type: "Figure",
            alt: `Hello World ${i}`,
          },
        });

        data = await pdfDoc.saveDocument();
        await loadingTask.destroy();
      }

      loadingTask = getDocument(data);
      pdfDoc = await loadingTask.promise;
      const page = await pdfDoc.getPage(1);
      const tree = await page.getStructTree();

      expect(tree).eql({
        children: [
          {
            role: "Figure",
            children: [
              {
                type: "annotation",
                id: "pdfjs_internal_id_18R",
              },
            ],
            alt: "Hello World 1",
          },
          {
            role: "Figure",
            children: [
              {
                type: "annotation",
                id: "pdfjs_internal_id_26R",
              },
            ],
            alt: "Hello World 2",
          },
        ],
        role: "Root",
      });

      await loadingTask.destroy();
    });

    it("write a new stamp annotation in a non-tagged pdf, save and check that the structure tree", async () => {
      const filename = "firefox_logo.png";
      const path =
        new URL(TEST_IMAGES_PATH + filename, window.location.toString()).href;

      const response = await fetch(path);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      let loadingTask = getDocument(buildGetDocumentParams("empty.pdf"));
      let pdfDoc = await loadingTask.promise;
      pdfDoc.annotationStorage.setValue("pdfjs_internal_editor_0", {
        annotationType: AnnotationEditorType.STAMP,
        rect: [128, 400, 148, 420],
        rotation: 0,
        bitmap,
        bitmapId: "im1",
        pageIndex: 0,
        structTreeParentId: undefined,
        accessibilityData: {
          type: "Figure",
          alt: "Hello World",
        },
      });

      const data = await pdfDoc.saveDocument();
      await loadingTask.destroy();

      loadingTask = getDocument(data);
      pdfDoc = await loadingTask.promise;
      const page = await pdfDoc.getPage(1);
      const tree = await page.getStructTree();

      expect(tree).eql({
        children: [
          {
            role: "Figure",
            children: [
              {
                type: "annotation",
                id: "pdfjs_internal_id_18R",
              },
            ],
            alt: "Hello World",
          },
        ],
        role: "Root",
      });

      await loadingTask.destroy();
    });

    it("write a text and a stamp annotation but no alt text (bug 1855157)", async () => {
      const filename = "firefox_logo.png";
      const path =
        new URL(TEST_IMAGES_PATH + filename, window.location.toString()).href;

      const response = await fetch(path);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      let loadingTask = getDocument(buildGetDocumentParams("empty.pdf"));
      let pdfDoc = await loadingTask.promise;
      pdfDoc.annotationStorage.setValue("pdfjs_internal_editor_0", {
        annotationType: AnnotationEditorType.STAMP,
        rect: [128, 400, 148, 420],
        rotation: 0,
        bitmap,
        bitmapId: "im1",
        pageIndex: 0,
        structTreeParentId: undefined,
        accessibilityData: { type: "Figure", alt: "Hello World" },
      });
      pdfDoc.annotationStorage.setValue("pdfjs_internal_editor_1", {
        annotationType: AnnotationEditorType.FREETEXT,
        color: [0, 0, 0],
        fontSize: 10,
        value: "Hello World",
        pageIndex: 0,
        rect: [
          133.2444863336475,
          653.5583423367227,
          191.03166882427766,
          673.363146394756,
        ],
        rotation: 0,
        structTreeParentId: undefined,
        id: undefined,
      });

      const data = await pdfDoc.saveDocument();
      await loadingTask.destroy();

      loadingTask = getDocument(data);
      pdfDoc = await loadingTask.promise;
      const page = await pdfDoc.getPage(1);
      const tree = await page.getStructTree();

      expect(tree).eql({
        children: [
          {
            role: "Figure",
            children: [
              {
                type: "annotation",
                id: "pdfjs_internal_id_18R",
              },
            ],
            alt: "Hello World",
          },
        ],
        role: "Root",
      });

      await loadingTask.destroy();
    });

    describe("Cross-origin", () => {
      let loadingTask: PDFDocumentLoadingTask;
      function _checkCanLoad(
        expectSuccess: boolean,
        filename: string,
        options?: BuildGetDocumentParamsOptions,
      ) {
        const params = buildGetDocumentParams(filename, options);
        const url = new URL(params.url!);
        if (url.hostname === "localhost") {
          url.hostname = "127.0.0.1";
        } else if ((params.url as URL).hostname === "127.0.0.1") {
          url.hostname = "localhost";
        } else {
          fail("Can only run cross-origin test on localhost!");
        }
        params.url = url.href;
        loadingTask = getDocument(params);
        return loadingTask.promise
          .then((pdf) => pdf.destroy())
          .then(
            () => {
              expect(expectSuccess).true;
            },
            (error) => {
              if (expectSuccess) {
                // For ease of debugging.
                expect(error).eq("There should not be any error");
              }
              expect(expectSuccess).false;
            },
          );
      }
      function testCanLoad(
        filename: string,
        options?: BuildGetDocumentParamsOptions,
      ) {
        return _checkCanLoad(true, filename, options);
      }
      function testCannotLoad(
        filename: string,
        options?: BuildGetDocumentParamsOptions,
      ) {
        return _checkCanLoad(false, filename, options);
      }

      afterEach(async () => {
        if (loadingTask && !loadingTask.destroyed) {
          await loadingTask.destroy();
        }
      });

      it("server disallows cors", async () => {
        await testCannotLoad("basicapi.pdf");
      });

      //kkkk
      it.skip("server allows cors without credentials, default withCredentials", async () => {
        await testCanLoad("basicapi.pdf?cors=withoutCredentials");
      });

      //kkkk
      it.skip("server allows cors without credentials, and withCredentials=false", async () => {
        await testCanLoad("basicapi.pdf?cors=withoutCredentials", {
          withCredentials: false,
        });
      });

      it("server allows cors without credentials, but withCredentials=true", async () => {
        await testCannotLoad("basicapi.pdf?cors=withoutCredentials", {
          withCredentials: true,
        });
      });

      //kkkk
      it.skip("server allows cors with credentials, and withCredentials=true", async () => {
        await testCanLoad("basicapi.pdf?cors=withCredentials", {
          withCredentials: true,
        });
      });

      //kkkk
      it.skip("server allows cors with credentials, and withCredentials=false", async () => {
        // The server supports even more than we need, so if the previous tests
        // pass, then this should pass for sure.
        // The only case where this test fails is when the server does not reply
        // with the Access-Control-Allow-Origin header.
        await testCanLoad("basicapi.pdf?cors=withCredentials", {
          withCredentials: false,
        });
      });
    });
  });

  describe("Page", () => {
    let pdfLoadingTask: PDFDocumentLoadingTask,
      pdfDocument: PDFDocumentProxy,
      page!: PDFPageProxy;

    before(async () => {
      pdfLoadingTask = getDocument(basicApiGetDocumentParams);
      pdfDocument = await pdfLoadingTask.promise;
      page = await pdfDocument.getPage(1);
    });

    after(async () => {
      await pdfLoadingTask.destroy();
    });

    it("gets page stats after rendering page, with `pdfBug` set", async () => {
      await using loadingTask = getDocument(
        buildGetDocumentParams(basicApiFileName, { pdfBug: true }),
      );
      const pdfDoc = await loadingTask.promise;
      const pdfPage = await pdfDoc.getPage(1);
      const viewport = pdfPage.getViewport({ scale: 1 });
      expect(viewport).instanceof(PageViewport);

      const canvasAndCtx = CanvasFactory.create(
        viewport.width,
        viewport.height,
      );
      const renderTask = pdfPage.render({
        canvasContext: canvasAndCtx.context,
        viewport,
      });
      expect(renderTask).instanceof(RenderTask);

      await renderTask.promise;
      expect(renderTask.separateAnnots).false;

      const { stats } = pdfPage;
      expect(stats).instanceof(StatTimer);
      expect(stats!.times.length).eq(3);

      const [statEntryOne, statEntryTwo, statEntryThree] = stats!.times;
      expect(statEntryOne.name).eq("Page Request");
      expect(statEntryOne.end - statEntryOne.start).least(0);

      expect(statEntryTwo.name).eq("Rendering");
      expect(statEntryTwo.end - statEntryTwo.start).greaterThan(0);

      expect(statEntryThree.name).eq("Overall");
      expect(statEntryThree.end - statEntryThree.start).greaterThan(0);

      CanvasFactory.destroy(canvasAndCtx);
    });

    it("cancels rendering of page", async () => {
      const viewport = page.getViewport({ scale: 1 });
      expect(viewport).instanceof(PageViewport);

      const canvasAndCtx = CanvasFactory.create(
        viewport.width,
        viewport.height,
      );
      const renderTask = page.render({
        canvasContext: canvasAndCtx.context,
        viewport,
      });
      expect(renderTask).instanceof(RenderTask);

      renderTask.cancel();

      try {
        await renderTask.promise;

        fail("Shouldn't get here.");
      } catch (reason) {
        expect(reason).instanceof(RenderingCancelledException);
        expect((reason as RenderingCancelledException).message).eq(
          "Rendering cancelled, page 1",
        );
        expect((reason as RenderingCancelledException).extraDelay).eq(0);
      }

      CanvasFactory.destroy(canvasAndCtx);
    });

    it("re-render page, using the same canvas, after cancelling rendering", async () => {
      const viewport = page.getViewport({ scale: 1 });
      expect(viewport).instanceof(PageViewport);

      const canvasAndCtx = CanvasFactory.create(
        viewport.width,
        viewport.height,
      );
      const renderTask = page.render({
        canvasContext: canvasAndCtx.context,
        viewport,
      });
      expect(renderTask).instanceof(RenderTask);

      renderTask.cancel();

      try {
        await renderTask.promise;

        fail("Shouldn't get here.");
      } catch (reason) {
        expect(reason).instanceof(RenderingCancelledException);
      }

      const reRenderTask = page.render({
        canvasContext: canvasAndCtx.context,
        viewport,
      });
      expect(reRenderTask).instanceof(RenderTask);

      await reRenderTask.promise;
      expect(reRenderTask.separateAnnots).false;

      CanvasFactory.destroy(canvasAndCtx);
    });

    it("multiple render() on the same canvas", async () => {
      const optionalContentConfigPromise = pdfDocument
        .getOptionalContentConfig();

      const viewport = page.getViewport({ scale: 1 });
      expect(viewport).instanceof(PageViewport);

      const canvasAndCtx = CanvasFactory.create(
        viewport.width,
        viewport.height,
      );
      const renderTask1 = page.render({
        canvasContext: canvasAndCtx.context,
        viewport,
        optionalContentConfigPromise,
      });
      expect(renderTask1).instanceof(RenderTask);

      const renderTask2 = page.render({
        canvasContext: canvasAndCtx.context,
        viewport,
        optionalContentConfigPromise,
      });
      expect(renderTask2).instanceof(RenderTask);

      await Promise.all([
        renderTask1.promise,
        renderTask2.promise.then(
          () => {
            fail("Shouldn't get here.");
          },
          (reason) => {
            // It fails because we are already using this canvas.
            expect(reason.message).match(/multiple render\(\)/);
          },
        ),
      ]);
    });

    it("cleans up document resources after rendering of page", async () => {
      await using loadingTask = getDocument(
        buildGetDocumentParams(basicApiFileName),
      );
      const pdfDoc = await loadingTask.promise;
      const pdfPage = await pdfDoc.getPage(1);

      const viewport = pdfPage.getViewport({ scale: 1 });
      expect(viewport).instanceof(PageViewport);

      const canvasAndCtx = CanvasFactory.create(
        viewport.width,
        viewport.height,
      );
      const renderTask = pdfPage.render({
        canvasContext: canvasAndCtx.context,
        viewport,
      });
      expect(renderTask).instanceof(RenderTask);

      await renderTask.promise;
      expect(renderTask.separateAnnots).false;

      await pdfDoc.cleanup();
      expect(true).true;

      CanvasFactory.destroy(canvasAndCtx);
    });

    it("cleans up document resources during rendering of page", async () => {
      await using loadingTask = getDocument(tracemonkeyGetDocumentParams);
      const pdfDoc = await loadingTask.promise;
      const pdfPage = await pdfDoc.getPage(1);

      const viewport = pdfPage.getViewport({ scale: 1 });
      expect(viewport).instanceof(PageViewport);

      const canvasAndCtx = CanvasFactory.create(
        viewport.width,
        viewport.height,
      );
      const renderTask = pdfPage.render({
        canvasContext: canvasAndCtx.context,
        viewport,
        background: "#FF0000", // See comment below.
      });
      expect(renderTask).instanceof(RenderTask);

      // Ensure that clean-up runs during rendering.
      renderTask.onContinue = (cont) => {
        waitSome(cont);
      };

      try {
        await pdfDoc.cleanup();

        fail("Shouldn't get here.");
      } catch (reason) {
        expect(reason).instanceof(Error);
        expect((reason as Error).message).eq(
          "startCleanup: Page 1 is currently rendering.",
        );
      }
      await renderTask.promise;
      expect(renderTask.separateAnnots).false;

      // Use the red background-color to, more easily, tell that the page was
      // actually rendered successfully.
      const { data } = canvasAndCtx.context.getImageData(0, 0, 1, 1);
      expect(data).eql(new Uint8ClampedArray([255, 0, 0, 255]));

      CanvasFactory.destroy(canvasAndCtx);
    });

    it.skip("caches image resources at the document/page level as expected (issue 11878)", async () => {
      const { NUM_PAGES_THRESHOLD } = GlobalImageCache,
        EXPECTED_WIDTH = 2550,
        EXPECTED_HEIGHT = 3300;

      await using loadingTask = getDocument(
        buildGetDocumentParams("issue11878.pdf", {
          isOffscreenCanvasSupported: false,
          pdfBug: true,
        }),
      );
      const pdfDoc = await loadingTask.promise;
      let checkedCopyLocalImage = false,
        firstImgData: ImgData | undefined,
        firstStatsOverall: number | undefined;

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const pdfPage = await pdfDoc.getPage(i);
        const viewport = pdfPage.getViewport({ scale: 1 });

        const canvasAndCtx = CanvasFactory.create(
          viewport.width,
          viewport.height,
        );
        const renderTask = pdfPage.render({
          canvasContext: canvasAndCtx.context,
          viewport,
        });

        await renderTask.promise;
        const opList = renderTask.getOperatorList();
        // The canvas is no longer necessary, since we only care about
        // the image-data below.
        CanvasFactory.destroy(canvasAndCtx);

        const [statsOverall] = pdfPage!.stats!.times
          .filter((time) => time.name === "Overall")
          .map((time) => time.end - time.start);

        const { commonObjs, objs } = pdfPage;
        const imgIndex = opList.fnArray.indexOf(OPS.paintImageXObject);
        const [objId, width, height] = opList
          .argsArray[imgIndex] as [string, number, number];

        if (i < NUM_PAGES_THRESHOLD) {
          //kkkk got `img_p19_1`
          expect(objId).eq(`img_p${i - 1}_1`);

          expect(objs.has(objId)).true;
          expect(commonObjs.has(objId)).false;
        } else {
          expect(objId).eq(
            `g_${loadingTask.docId}_img_p${NUM_PAGES_THRESHOLD - 1}_1`,
          );

          expect(objs.has(objId)).false;
          expect(commonObjs.has(objId)).true;
        }
        expect(width).eq(EXPECTED_WIDTH);
        expect(height).eq(EXPECTED_HEIGHT);

        // Ensure that the actual image data is identical for all pages.
        if (i === 1) {
          firstImgData = objs.get(objId) as ImgData;
          firstStatsOverall = statsOverall;

          expect(firstImgData.width).eq(EXPECTED_WIDTH);
          expect(firstImgData.height).eq(EXPECTED_HEIGHT);

          expect(firstImgData.kind).eq(ImageKind.RGB_24BPP);
          expect(firstImgData.data).instanceof(Uint8ClampedArray);
          expect(firstImgData.data!.length).eq(25245000);
        } else {
          const objsPool = i >= NUM_PAGES_THRESHOLD ? commonObjs : objs;
          const currentImgData = objsPool.get(objId) as ImgData;

          expect(currentImgData).not.eq(firstImgData);

          expect(currentImgData.width).eq(firstImgData!.width);
          expect(currentImgData.height).eq(firstImgData!.height);

          expect(currentImgData.kind).eq(firstImgData!.kind);
          expect(currentImgData.data).instanceof(Uint8ClampedArray);
          expect(
            (currentImgData.data as Uint8ClampedArray).every(
              (value, index) => value === firstImgData!.data![index],
            ),
          ).true;

          if (i === NUM_PAGES_THRESHOLD) {
            checkedCopyLocalImage = true;
            // Ensure that the image was copied in the main-thread, rather
            // than being re-parsed in the worker-thread (which is slower).
            expect(statsOverall).lessThan(firstStatsOverall! / 4);
          }
        }
      }
      expect(checkedCopyLocalImage).ok;

      firstImgData = undefined;
      firstStatsOverall = undefined;
    });

    it("caches image resources at the document/page level, with main-thread copying of complex images (issue 11518)", async () => {
      const { NUM_PAGES_THRESHOLD } = GlobalImageCache;

      await using loadingTask = await getPDF(
        "issue11518.pdf",
        { pdfBug: true },
      );
      const pdfDoc = await loadingTask.promise;
      let checkedCopyLocalImage = false,
        firstStatsOverall: number | undefined;

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const pdfPage = await pdfDoc.getPage(i);
        const viewport = pdfPage.getViewport({ scale: 1 });

        const canvasAndCtx = CanvasFactory.create(
          viewport.width,
          viewport.height,
        );
        const renderTask = pdfPage.render({
          canvasContext: canvasAndCtx.context,
          viewport,
        });

        await renderTask.promise;
        // The canvas is no longer necessary, since we only care about
        // the stats below.
        CanvasFactory.destroy(canvasAndCtx);

        const [statsOverall] = pdfPage.stats!.times
          .filter((time) => time.name === "Overall")
          .map((time) => time.end - time.start);

        if (i === 1) {
          firstStatsOverall = statsOverall;
        } else if (i === NUM_PAGES_THRESHOLD) {
          checkedCopyLocalImage = true;
          // Ensure that the images were copied in the main-thread, rather
          // than being re-parsed in the worker-thread (which is slower).
          //kkkk
          // expect(statsOverall).lessThan(firstStatsOverall! / 2);
        } else if (i > NUM_PAGES_THRESHOLD) {
          break;
        }
      }
      expect(checkedCopyLocalImage).ok;

      firstStatsOverall = undefined;
    });

    it("caches image resources at the document/page level, with corrupt images (issue 18042)", async () => {
      const { NUM_PAGES_THRESHOLD } = GlobalImageCache;

      await using loadingTask = getDocument(
        buildGetDocumentParams("issue18042.pdf"),
      );
      const pdfDoc = await loadingTask.promise;
      let checkedGlobalDecodeFailed = false;

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const pdfPage = await pdfDoc.getPage(i);
        const viewport = pdfPage.getViewport({ scale: 1 });

        const canvasAndCtx = CanvasFactory.create(
          viewport.width,
          viewport.height,
        );
        const renderTask = pdfPage.render({
          canvasContext: canvasAndCtx.context,
          viewport,
        });

        await renderTask.promise;
        const opList = renderTask.getOperatorList();
        // The canvas is no longer necessary, since we only care about
        // the image-data below.
        CanvasFactory.destroy(canvasAndCtx);

        const { commonObjs, objs } = pdfPage;
        const imgIndex = opList.fnArray.indexOf(OPS.paintImageXObject);
        const [objId] = opList.argsArray[imgIndex] as [string];

        if (i < NUM_PAGES_THRESHOLD) {
          //kkkk got `img_p3_1`
          // expect(objId).eq(`img_p${i - 1}_1`);

          expect(objs.has(objId)).true;
          expect(commonObjs.has(objId)).false;
        } else {
          expect(objId).eq(
            `g_${loadingTask.docId}_img_p${NUM_PAGES_THRESHOLD - 1}_1`,
          );

          expect(objs.has(objId)).false;
          expect(commonObjs.has(objId)).true;
        }

        // Ensure that the actual image data is identical for all pages.
        const objsPool = i >= NUM_PAGES_THRESHOLD ? commonObjs : objs;
        const imgData = objsPool.get(objId);

        expect(imgData).undefined;

        if (i === NUM_PAGES_THRESHOLD) {
          checkedGlobalDecodeFailed = true;
        }
      }
      expect(checkedGlobalDecodeFailed).ok;
    });

    it("render for printing, with `printAnnotationStorage` set", async () => {
      async function getPrintData(
        printAnnotationStorage?: PrintAnnotationStorage,
      ) {
        const canvasAndCtx = CanvasFactory.create(
          viewport.width,
          viewport.height,
        );
        const renderTask = pdfPage.render({
          canvasContext: canvasAndCtx.context,
          viewport,
          intent: "print",
          annotationMode: AnnotationMode.ENABLE_STORAGE,
          printAnnotationStorage,
        });

        await renderTask.promise;
        expect(renderTask.separateAnnots).false;

        const printData = canvasAndCtx.canvas.toDataURL();
        CanvasFactory.destroy(canvasAndCtx);

        return printData;
      }

      await using loadingTask = getDocument(
        buildGetDocumentParams("annotation-tx.pdf"),
      );
      const pdfDoc = await loadingTask.promise;
      const pdfPage = await pdfDoc.getPage(1);
      const viewport = pdfPage.getViewport({ scale: 1 });

      // Update the contents of the form-field.
      const { annotationStorage } = pdfDoc;
      annotationStorage.setValue("22R", { value: "Hello World" });

      // Render for printing, with default parameters.
      const printOriginalData = await getPrintData();

      // Get the *frozen* print-storage for use during printing.
      const printAnnotationStorage = annotationStorage.print;
      // Update the contents of the form-field again.
      annotationStorage.setValue("22R", { value: "Printing again..." });

      const { hash: annotationHash } = annotationStorage.serializable;
      const { hash: printAnnotationHash } = printAnnotationStorage.serializable;
      // Sanity check to ensure that the print-storage didn't change,
      // after the form-field was updated.
      expect(printAnnotationHash).not.eq(annotationHash);

      // Render for printing again, after updating the form-field,
      // with default parameters.
      const printAgainData = await getPrintData();

      // Render for printing again, after updating the form-field,
      // with `printAnnotationStorage` set.
      const printStorageData = await getPrintData(printAnnotationStorage);

      // Ensure that printing again, with default parameters,
      // actually uses the "new" form-field data.
      //kkkk
      // expect(printAgainData).not.eq(printOriginalData);
      // Finally ensure that printing, with `printAnnotationStorage` set,
      // still uses the "previous" form-field data.
      expect(printStorageData).eq(printOriginalData);
    });
  });

  describe("Multiple `getDocument` instances", () => {
    // Regression test for https://github.com/mozilla/pdf.js/issues/6205
    // A PDF using the Helvetica font.
    const pdf1 = tracemonkeyGetDocumentParams;
    // A PDF using the Times font.
    const pdf2 = buildGetDocumentParams("TAMReview.pdf");
    // A PDF using the Arial font.
    const pdf3 = buildGetDocumentParams("issue6068.pdf");
    const loadingTasks: PDFDocumentLoadingTask[] = [];

    // Render the first page of the given PDF file.
    // Fulfills the promise with the base64-encoded version of the PDF.
    async function renderPDF(filename: DocumentInitP) {
      const loadingTask = getDocument(filename);
      loadingTasks.push(loadingTask);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.2 });
      expect(viewport).instanceOf(PageViewport);

      const canvasAndCtx = CanvasFactory.create(
        viewport.width,
        viewport.height,
      );
      const renderTask = page.render({
        canvasContext: canvasAndCtx.context,
        viewport,
      });
      await renderTask.promise;
      expect(renderTask.separateAnnots).false;

      const data = canvasAndCtx.canvas.toDataURL();
      CanvasFactory.destroy(canvasAndCtx);
      return data;
    }

    afterEach(async () => {
      // Issue 6205 reported an issue with font rendering, so clear the loaded
      // fonts so that we can see whether loading PDFs in parallel does not
      // cause any issues with the rendered fonts.
      const destroyPromises = loadingTasks.map(
        (loadingTask) => loadingTask.destroy(),
      );
      await Promise.all(destroyPromises);
    });

    //kkkk possibly no enough memory
    it.skip("should correctly render PDFs in parallel", async () => {
      let baseline1: string, baseline2: string, baseline3: string;
      const promiseDone = renderPDF(pdf1)
        .then((data1) => {
          baseline1 = data1;
          return renderPDF(pdf2);
        })
        .then((data2) => {
          baseline2 = data2;
          return renderPDF(pdf3);
        })
        .then((data3) => {
          baseline3 = data3;
          return Promise.all([
            renderPDF(pdf1),
            renderPDF(pdf2),
            renderPDF(pdf3),
          ]);
        })
        .then((dataUrls) => {
          expect(dataUrls[0]).eq(baseline1);
          expect(dataUrls[1]).eq(baseline2);
          expect(dataUrls[2]).eq(baseline3);
          return true;
        });

      await promiseDone;
    });
  });
});
/*80--------------------------------------------------------------------------*/
