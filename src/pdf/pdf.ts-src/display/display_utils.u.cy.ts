/** 80**************************************************************************
 * Converted from JavaScript to TypeScript by
 * [nmtigor](https://github.com/nmtigor) @2024
 *
 * @module pdf/pdf.ts-src/display/display_utils.u.cy
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

import {
  DOMCanvasFactory,
  DOMSVGFactory,
} from "@fe-pdf.ts-src/display/display_utils.ts";
/*80--------------------------------------------------------------------------*/

describe("display_utils", () => {
  describe("DOMCanvasFactory", () => {
    let canvasFactory: DOMCanvasFactory;

    before(() => {
      canvasFactory = new DOMCanvasFactory();
    });

    after(() => {
      canvasFactory = undefined as any;
    });

    it("`create` should return a canvas if the dimensions are valid", () => {
      const { canvas, context } = canvasFactory.create(20, 40);
      expect(canvas).instanceof(HTMLCanvasElement);
      expect(context).instanceof(CanvasRenderingContext2D);
      expect(canvas.width).eq(20);
      expect(canvas.height).eq(40);
    });

    it("`reset` should alter the canvas/context if the dimensions are valid", () => {
      const canvasAndContext = canvasFactory.create(20, 40);
      canvasFactory.reset(canvasAndContext, 60, 80);

      const { canvas, context } = canvasAndContext;
      expect(canvas).instanceof(HTMLCanvasElement);
      expect(context).instanceof(CanvasRenderingContext2D);
      expect(canvas.width).eq(60);
      expect(canvas.height).eq(80);
    });

    it("`destroy` should clear the canvas/context", () => {
      const canvasAndContext = canvasFactory.create(20, 40);
      canvasFactory.destroy(canvasAndContext);

      const { canvas, context } = canvasAndContext;
      expect(canvas).undefined;
      expect(context).undefined;
    });
  });

  describe("DOMSVGFactory", () => {
    let svgFactory: DOMSVGFactory;

    before(() => {
      svgFactory = new DOMSVGFactory();
    });

    after(() => {
      svgFactory = undefined as any;
    });

    it("`create` should return an SVG element if the dimensions are valid", () => {
      const svg = svgFactory.create(20, 40);
      expect(svg).instanceof(SVGSVGElement);
      expect(svg.getAttribute("version")).eq("1.1");
      expect(svg.getAttribute("width")).eq("20px");
      expect(svg.getAttribute("height")).eq("40px");
      expect(svg.getAttribute("preserveAspectRatio")).eq("none");
      expect(svg.getAttribute("viewBox")).eq("0 0 20 40");
    });
  });
});
/*80--------------------------------------------------------------------------*/
