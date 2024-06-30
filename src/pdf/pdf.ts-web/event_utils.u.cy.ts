/** 80**************************************************************************
 * Converted from JavaScript to TypeScript by
 * [nmtigor](https://github.com/nmtigor) @2024
 *
 * @module pdf/pdf.ts-web/event_utils.u.cy
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

import { html } from "@fe-lib/dom.ts";
import { fail } from "@fe-lib/util/trace.ts";
import {
  EventBus,
  waitOnEventOrTimeout,
  WaitOnType,
} from "@fe-pdf.ts-web/event_utils.ts";
/*80--------------------------------------------------------------------------*/

describe("event_utils", () => {
  describe("EventBus", () => {
    it("should not re-dispatch to DOM", async () => {
      const eventBus = new EventBus();
      let count = 0;
      eventBus.on("test", (evt) => {
        expect(evt).undefined;
        count++;
      });
      function domEventListener() {
        fail("Shouldn't get here.");
      }
      document.addEventListener("test", domEventListener);

      eventBus.dispatch("test");

      await Promise.resolve();
      expect(count).eq(1);

      document.removeEventListener("test", domEventListener);
    });
  });

  describe("waitOnEventOrTimeout", () => {
    let eventBus: EventBus;

    before(() => {
      eventBus = new EventBus();
    });

    after(() => {
      eventBus = undefined as any;
    });

    it("should resolve on event, using the DOM", async () => {
      const button = html("button");

      const buttonClicked = waitOnEventOrTimeout({
        target: button,
        name: "click",
        delay: 10000,
      } as any);
      // Immediately dispatch the expected event.
      button.click();

      const type = await buttonClicked;
      expect(type).eq(WaitOnType.EVENT);
    });

    it("should resolve on timeout, using the DOM", async () => {
      const button = html("button");

      const buttonClicked = waitOnEventOrTimeout({
        target: button,
        name: "click",
        delay: 10,
      } as any);
      // Do *not* dispatch the event, and wait for the timeout.

      const type = await buttonClicked;
      expect(type).eq(WaitOnType.TIMEOUT);
    });
  });
});
/*80--------------------------------------------------------------------------*/
