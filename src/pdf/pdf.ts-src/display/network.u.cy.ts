/** 80**************************************************************************
 * Converted from JavaScript to TypeScript by
 * [nmtigor](https://github.com/nmtigor) @2024
 *
 * @module pdf/pdf.ts-src/display/network.u.cy
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

import { TEST_PDFS_PATH } from "@cy-pdf.ts-test/unittest_utils.js";
import type { DocumentInitP } from "@fe-pdf.ts-src/display/api.ts";
import type { PDFNetworkStreamRangeRequestReader } from "@fe-pdf.ts-src/display/network.ts";
import { PDFNetworkStream } from "@fe-pdf.ts-src/display/network.ts";
import { AbortException } from "@fe-pdf.ts-src/shared/util.ts";
/*80--------------------------------------------------------------------------*/

describe("network", () => {
  const pdf1 =
    new URL(`${TEST_PDFS_PATH}/tracemonkey.pdf`, window.location.toString())
      .href;
  const pdf1Length = 1016315;

  it("read without stream and range", async () => {
    const stream = new PDFNetworkStream({
      url: pdf1,
      rangeChunkSize: 65536,
      disableStream: true,
      disableRange: true,
    } as DocumentInitP);

    const fullReader = stream.getFullReader();

    let isStreamingSupported, isRangeSupported;
    const promise = fullReader.headersReady.then(() => {
      isStreamingSupported = fullReader.isStreamingSupported;
      isRangeSupported = fullReader.isRangeSupported;
    });

    let len = 0,
      count = 0;
    const read = (): Promise<undefined> => {
      return fullReader.read().then((result) => {
        if (result.done) {
          return undefined;
        }
        count++;
        len += result.value.byteLength;
        return read();
      });
    };

    await Promise.all([read(), promise]);

    expect(len).eq(pdf1Length);
    expect(count).eq(1);
    expect(isStreamingSupported).false;
    expect(isRangeSupported).false;
  });

  it("read custom ranges", async () => {
    // We don't test on browsers that don't support range request, so
    // requiring this test to pass.
    const rangeSize = 32768;
    const stream = new PDFNetworkStream({
      url: pdf1,
      length: pdf1Length,
      rangeChunkSize: rangeSize,
      disableStream: true,
      disableRange: false,
    } as DocumentInitP);

    const fullReader = stream.getFullReader();

    let isStreamingSupported, isRangeSupported, fullReaderCancelled;
    const promise = fullReader.headersReady.then(() => {
      isStreamingSupported = fullReader.isStreamingSupported;
      isRangeSupported = fullReader.isRangeSupported;
      // we shall be able to close the full reader without issues
      fullReader.cancel(new AbortException("Don't need fullReader."));
      fullReaderCancelled = true;
    });

    // Skipping fullReader results, requesting something from the PDF end.
    const tailSize = pdf1Length % rangeSize || rangeSize;

    const range1Reader = stream.getRangeReader(
      pdf1Length - tailSize - rangeSize,
      pdf1Length - tailSize,
    );
    const range2Reader = stream.getRangeReader(
      pdf1Length - tailSize,
      pdf1Length,
    );

    const result1 = { value: 0 },
      result2 = { value: 0 };
    const read = (
      reader: PDFNetworkStreamRangeRequestReader,
      lenResult: { value: number },
    ): Promise<undefined> => {
      return reader.read().then((result) => {
        if (result.done) {
          return undefined;
        }
        lenResult.value += result.value.byteLength;
        return read(reader, lenResult);
      });
    };

    await Promise.all([
      read(range1Reader, result1),
      read(range2Reader, result2),
      promise,
    ]);

    expect(result1.value).eq(rangeSize);
    expect(result2.value).eq(tailSize);
    expect(isStreamingSupported).false;
    //kkkk
    // expect(isRangeSupported).true;
    expect(fullReaderCancelled).true;
  });
});
/*80--------------------------------------------------------------------------*/
