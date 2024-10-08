/** 80**************************************************************************
 * Converted from JavaScript to TypeScript by
 * [nmtigor](https://github.com/nmtigor) @2024
 *
 * @module pdf/pdf.ts-web/app_options_test.u.cy
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

import { objectSize } from "@fe-pdf.ts-src/shared/util.ts";
import { AppOptions, OptionKind } from "@fe-pdf.ts-web/app_options.ts";
/*80--------------------------------------------------------------------------*/

describe("AppOptions", () => {
  it("checks that getAll returns data, for every OptionKind", () => {
    const KIND_NAMES: (keyof typeof OptionKind)[] = [
      "BROWSER",
      "VIEWER",
      "API",
      "WORKER",
      "PREFERENCE",
    ];

    for (const name of KIND_NAMES) {
      const kind = OptionKind[name];
      expect(typeof kind).eq("number");

      const options = AppOptions.getAll(kind);
      expect(objectSize(options)).gt(0);
    }
  });

  it('checks that the number of "PREFERENCE" options does *not* exceed the maximum in mozilla-central', () => {
    // If the following constant is updated then you *MUST* make the same change
    // in mozilla-central as well to ensure that preference-fetching works; see
    // https://searchfox.org/mozilla-central/source/toolkit/components/pdfjs/content/PdfStreamConverter.sys.mjs
    const MAX_NUMBER_OF_PREFS = 50;

    const options = AppOptions.getAll(OptionKind.PREFERENCE);
    expect(objectSize(options)).lte(MAX_NUMBER_OF_PREFS);
  });
});
/*80--------------------------------------------------------------------------*/
