/** 80**************************************************************************
 * Converted from JavaScript to TypeScript by
 * [nmtigor](https://github.com/nmtigor) @2024
 *
 * @module pdf/pdf.ts-web/pdf_viewer.u.cy
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

import { PDFPageViewBuffer } from "@fe-pdf.ts-web/pdf_viewer.ts";
/*80--------------------------------------------------------------------------*/

describe("PDFViewer", () => {
  describe("PDFPageViewBuffer", () => {
    function createViewsMap(startId: number, endId: number) {
      const map = new Map();

      for (let id = startId; id <= endId; id++) {
        map.set(id, {
          id,
          destroy: () => {},
        });
      }
      return map;
    }

    it("handles `push` correctly", () => {
      const buffer = new PDFPageViewBuffer(3);

      const viewsMap = createViewsMap(1, 5),
        iterator = viewsMap.values();

      for (let i = 0; i < 3; i++) {
        const view = iterator.next().value;
        buffer.push(view);
      }
      // Ensure that the correct views are inserted.
      expect([...buffer]).eql([
        viewsMap.get(1),
        viewsMap.get(2),
        viewsMap.get(3),
      ]);

      for (let i = 3; i < 5; i++) {
        const view = iterator.next().value;
        buffer.push(view);
      }
      // Ensure that the correct views are evicted.
      expect([...buffer]).eql([
        viewsMap.get(3),
        viewsMap.get(4),
        viewsMap.get(5),
      ]);
    });

    it("handles `resize` correctly", () => {
      const buffer = new PDFPageViewBuffer(5);

      const viewsMap = createViewsMap(1, 5),
        iterator = viewsMap.values();

      for (let i = 0; i < 5; i++) {
        const view = iterator.next().value;
        buffer.push(view);
      }
      // Ensure that keeping the size constant won't evict any views.
      buffer.resize(5);

      expect([...buffer]).eql([
        viewsMap.get(1),
        viewsMap.get(2),
        viewsMap.get(3),
        viewsMap.get(4),
        viewsMap.get(5),
      ]);

      // Ensure that increasing the size won't evict any views.
      buffer.resize(10);

      expect([...buffer]).eql([
        viewsMap.get(1),
        viewsMap.get(2),
        viewsMap.get(3),
        viewsMap.get(4),
        viewsMap.get(5),
      ]);

      // Ensure that decreasing the size will evict the correct views.
      buffer.resize(3);

      expect([...buffer]).eql([
        viewsMap.get(3),
        viewsMap.get(4),
        viewsMap.get(5),
      ]);
    });

    it("handles `resize` correctly, with `idsToKeep` provided", () => {
      const buffer = new PDFPageViewBuffer(5);

      const viewsMap = createViewsMap(1, 5),
        iterator = viewsMap.values();

      for (let i = 0; i < 5; i++) {
        const view = iterator.next().value;
        buffer.push(view);
      }
      // Ensure that keeping the size constant won't evict any views,
      // while re-ordering them correctly.
      buffer.resize(5, new Set([1, 2]));

      expect([...buffer]).eql([
        viewsMap.get(3),
        viewsMap.get(4),
        viewsMap.get(5),
        viewsMap.get(1),
        viewsMap.get(2),
      ]);

      // Ensure that increasing the size won't evict any views,
      // while re-ordering them correctly.
      buffer.resize(10, new Set([3, 4, 5]));

      expect([...buffer]).eql([
        viewsMap.get(1),
        viewsMap.get(2),
        viewsMap.get(3),
        viewsMap.get(4),
        viewsMap.get(5),
      ]);

      // Ensure that decreasing the size will evict the correct views,
      // while re-ordering the remaining ones correctly.
      buffer.resize(3, new Set([1, 2, 5]));

      expect([...buffer]).eql([
        viewsMap.get(1),
        viewsMap.get(2),
        viewsMap.get(5),
      ]);
    });

    it("handles `has` correctly", () => {
      const buffer = new PDFPageViewBuffer(3);

      const viewsMap = createViewsMap(1, 2),
        iterator = viewsMap.values();

      for (let i = 0; i < 1; i++) {
        const view = iterator.next().value;
        buffer.push(view);
      }
      expect(buffer.has(viewsMap.get(1))).eq(true);
      expect(buffer.has(viewsMap.get(2))).eq(false);
    });
  });
});
/*80--------------------------------------------------------------------------*/
