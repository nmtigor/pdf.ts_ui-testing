/** 80**************************************************************************
 * Converted from JavaScript to TypeScript by
 * [nmtigor](https://github.com/nmtigor) @2024
 *
 * @module pdf/pdf.ts-web/pdf_find_controller.u.cy
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

import type { PDFDocumentProxy } from "@fe-pdf.ts-src/display/api.ts";
import { EventBus, type EventMap } from "@fe-pdf.ts-web/event_utils.ts";
import type { FindCtrlState } from "@fe-pdf.ts-web/pdf_find_controller.ts";
import { PDFFindController } from "@fe-pdf.ts-web/pdf_find_controller.ts";
import { SimpleLinkService } from "@fe-pdf.ts-web/pdf_link_service.ts";
import { CMAP_URL, getPDF } from "../pdf.ts-test/test_utils.ts";
/*80--------------------------------------------------------------------------*/

const tracemonkeyFileName = "tracemonkey.pdf";

class MockLinkService extends SimpleLinkService {
  _page = 1;
  override get page() {
    return this._page;
  }
  override set page(value) {
    this._page = value;
  }

  _pdfDocument: PDFDocumentProxy | undefined;
  override setDocument(pdfDocument?: PDFDocumentProxy) {
    this._pdfDocument = pdfDocument;
  }
  override get pagesCount() {
    return this._pdfDocument!.numPages;
  }

  constructor() {
    super();
  }
}

async function initPdfFindController(
  filename?: string,
  updateMatchesCountOnProgress = true,
) {
  const loadingTask = await getPDF(filename || tracemonkeyFileName, {
    cMapUrl: CMAP_URL,
  });
  const pdfDocument = await loadingTask.promise;

  const eventBus = new EventBus();

  const linkService = new MockLinkService();
  linkService.setDocument(pdfDocument);

  const pdfFindController = new PDFFindController({
    linkService,
    eventBus,
    updateMatchesCountOnProgress,
  });
  pdfFindController.setDocument(pdfDocument); // Enable searching.

  return {
    eventBus,
    pdfFindController,
    async [Symbol.asyncDispose]() {
      await loadingTask.destroy();
    },
  };
}

type TestSearchP_ = {
  eventBus: EventBus;
  pdfFindController: PDFFindController;
  state: Partial<FindCtrlState>;
  matchesPerPage: number[];
  selectedMatch: {
    pageIndex: number;
    matchIndex: number;
  };
  pageMatches?: number[][];
  pageMatchesLength?: number[][];
  updateFindMatchesCount?: number[];
  updateFindControlState?: number[];
};

function testSearch({
  eventBus,
  pdfFindController,
  state,
  matchesPerPage,
  selectedMatch,
  pageMatches,
  pageMatchesLength,
  updateFindMatchesCount,
  updateFindControlState,
}: TestSearchP_) {
  return new Promise<void>(function (this: any, resolve) {
    const eventState: EventMap["find"] = Object.assign(
      Object.create(null),
      {
        source: this,
        type: "",
        query: undefined,
        caseSensitive: false,
        entireWord: false,
        findPrevious: false,
        matchDiacritics: false,
      },
      state,
    );
    eventBus.dispatch("find", eventState);

    // The `updatefindmatchescount` event is only emitted if the page contains
    // at least one match for the query, so the last non-zero item in the
    // matches per page array corresponds to the page for which the final
    // `updatefindmatchescount` event is emitted. If this happens, we know
    // that any subsequent pages won't trigger the event anymore and we
    // can start comparing the matches per page. This logic is necessary
    // because we call the `pdfFindController.pageMatches` getter directly
    // after receiving the event and the underlying `_pageMatches` array
    // is only extended when a page is processed, so it will only contain
    // entries for the pages processed until the time when the final event
    // was emitted.
    let totalPages = matchesPerPage.length;
    for (let i = totalPages; i--;) {
      if (matchesPerPage[i] > 0) {
        totalPages = i + 1;
        break;
      }
    }

    const totalMatches = matchesPerPage.reduce((a, b) => a + b);

    if (updateFindControlState) {
      eventBus.on(
        "updatefindcontrolstate",
        () => {
          updateFindControlState[0] += 1;
        },
      );
    }

    eventBus.on(
      "updatefindmatchescount",
      function onUpdateFindMatchesCount(
        evt: EventMap["updatefindmatchescount"],
      ) {
        if (updateFindMatchesCount) {
          updateFindMatchesCount[0] += 1;
        }
        if (pdfFindController.pageMatches.length !== totalPages) {
          return;
        }
        eventBus.off("updatefindmatchescount", onUpdateFindMatchesCount);

        expect(evt.matchesCount.total).eq(totalMatches);
        for (let i = 0; i < totalPages; i++) {
          expect(pdfFindController.pageMatches[i].length).eq(matchesPerPage[i]);
        }
        expect(pdfFindController.selected.pageIdx).eq(selectedMatch.pageIndex);
        expect(pdfFindController.selected.matchIdx)
          .eq(selectedMatch.matchIndex);

        if (pageMatches) {
          expect(pdfFindController.pageMatches).eql(pageMatches);
          expect(pdfFindController.pageMatchesLength).eql(pageMatchesLength);
        }

        resolve();
      },
    );
  });
}

describe("pdf_find_controller", () => {
  it("performs a search in a text containing diacritics before -\\n", async () => {
    const inited = await initPdfFindController("issue14562.pdf");
    const { eventBus, pdfFindController } = inited;

    await testSearch({
      eventBus,
      pdfFindController,
      state: {
        query: "ä",
        matchDiacritics: true,
      },
      matchesPerPage: [80],
      selectedMatch: {
        pageIndex: 0,
        matchIndex: 0,
      },
      // deno-fmt-ignore
      pageMatches: [
        [
          302, 340, 418, 481, 628, 802, 983, 989, 1015, 1063, 1084, 1149, 1157,
          1278, 1346, 1394, 1402, 1424, 1500, 1524, 1530, 1686, 1776, 1788,
          1859, 1881, 1911, 1948, 2066, 2076, 2163, 2180, 2215, 2229, 2274,
          2324, 2360, 2402, 2413, 2424, 2463, 2532, 2538, 2553, 2562, 2576,
          2602, 2613, 2638, 2668, 2792, 2805, 2836, 2847, 2858, 2895, 2901,
          2915, 2939, 2959, 3089, 3236, 3246, 3336, 3384, 3391, 3465, 3474,
          3482, 3499, 3687, 3693, 3708, 3755, 3786, 3862, 3974, 4049, 4055,
          4068,
        ],
      ],
      // deno-fmt-ignore
      pageMatchesLength: [
        [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        ],
      ],
    });
  });

  it("performs a search in a text containing combining diacritics", async () => {
    await using inited = await initPdfFindController("issue12909.pdf");
    const { eventBus, pdfFindController } = inited;

    await testSearch({
      eventBus,
      pdfFindController,
      state: {
        query: "הספר",
        matchDiacritics: true,
      },
      matchesPerPage: [0, 0, 0, 0, 0, 0, 0, 0, 1],
      selectedMatch: {
        pageIndex: 8,
        matchIndex: 0,
      },
    });

    await testSearch({
      eventBus,
      pdfFindController,
      state: {
        query: "הספר",
        matchDiacritics: false,
      },
      matchesPerPage: [0, 1, 0, 0, 0, 0, 0, 0, 1],
      selectedMatch: {
        pageIndex: 8,
        matchIndex: 0,
      },
    });
  });

  it("performs a search in a text with some UTF-32 chars", async () => {
    await using inited = await initPdfFindController("bug1820909.pdf");
    const { eventBus, pdfFindController } = inited;

    await testSearch({
      eventBus,
      pdfFindController,
      state: {
        query: "31350",
      },
      matchesPerPage: [1, 2],
      selectedMatch: {
        pageIndex: 0,
        matchIndex: 0,
      },
      pageMatches: [[41], [131, 1359]],
      pageMatchesLength: [[5], [5, 5]],
    });
  });
});
/*80--------------------------------------------------------------------------*/
