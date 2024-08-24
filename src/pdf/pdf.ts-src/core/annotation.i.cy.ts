/** 80**************************************************************************
 * Converted from JavaScript to TypeScript by
 * [nmtigor](https://github.com/nmtigor) @2024
 *
 * @module pdf/pdf.ts-src/core/annotation.i.cy
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
  getSelector,
  P_html,
  queriesFrom,
} from "@cy-pdf.ts-test/integrationtest_utils.ts";
import "cypress-real-events";
import "cypress-plugin-tab";
/*80--------------------------------------------------------------------------*/

describe("Annotation highlight", () => {
  describe("annotation-highlight.pdf", () => {
    before(() => {
      cy.visit(`/${P_html}?${queriesFrom("annotation-highlight.pdf")}`);
    });

    it("must show a popup on mouseover", () => {
      cy.get("[data-annotation-id='21R']").as("21R")
        .should("be.hidden");
      cy.get("[data-annotation-id='19R']").realHover();
      cy.get("@21R").should("be.visible");
    });
  });

  describe("Check that widget annotations are in front of highlight ones", () => {
    before(() => {
      cy.visit(`/${P_html}?${queriesFrom("bug1883609.pdf")}`);
    });

    it("must click on widget annotations", () => {
      for (const i of [23, 22, 14]) {
        cy.get(`[data-annotation-id='${i}R']`).click();
        cy.get(`#pdfjs_internal_id_${i}R:focus`);
      }
    });
  });
});

describe("Checkbox annotation", () => {
  describe("issue12706.pdf", () => {
    before(() => {
      cy.visit(`/${P_html}?${queriesFrom("issue12706.pdf")}`);
    });

    it("must let checkboxes with the same name behave like radio buttons", () => {
      const selectors = [63, 70, 79].map((n) => `[data-annotation-id='${n}R']`);
      for (const selector of selectors) {
        cy.get(selector).click()
          .children().first().should("be.checked");

        for (const otherSelector of selectors) {
          cy.get(`${otherSelector} > :first-child`).then(
            (jel) => {
              expect(
                (jel[0] as HTMLInputElement).checked,
                `In ${Cypress.browser.displayName}`,
              ).eq(selector === otherSelector);
            },
          );
        }
      }
    });
  });

  describe("issue15597.pdf", () => {
    before(() => {
      cy.visit(`/${P_html}?${queriesFrom("issue15597.pdf")}`);
    });

    it("must check the checkbox", () => {
      const selector = "[data-annotation-id='7R']";
      cy.get(selector).click()
        .children().first().should("be.checked");
    });
  });

  describe("bug1847733.pdf", () => {
    before(() => {
      cy.visit(`/${P_html}?${queriesFrom("bug1847733.pdf")}`);
    });

    it("must check the checkbox", () => {
      const selectors = [18, 30, 42, 54].map((id) =>
        `[data-annotation-id='${id}R']`
      );
      for (const selector of selectors) {
        cy.get(selector).click()
          .children().first().should("be.checked");
      }
    });
  });
});

describe("Text widget", () => {
  describe("issue13271.pdf", () => {
    before(() => {
      cy.visit(`/${P_html}?${queriesFrom("issue13271.pdf")}`);
    });

    it("must update all the fields with the same value", () => {
      const base = "hello world";
      cy.get(getSelector("25R")).type(base);
      cy.get(getSelector("24R")).should("not.have.value", "");
      cy.get(getSelector("26R")).should("not.have.value", "");
      cy.get(getSelector("24R")).should("have.value", base);
      cy.get(getSelector("26R")).should("have.value", base);
    });
  });

  describe("issue16473.pdf", () => {
    before(() => {
      cy.visit(`/${P_html}?${queriesFrom("issue16473.pdf")}`);
    });

    it("must reset a formatted value after a change", () => {
      cy.get(getSelector("22R")).type("a").tab()
        .should("not.have.value", "Hello world");
      // cy.get(getSelector("22R")).should("have.value", "aHello World");
      cy.get(getSelector("22R")).should("have.value", "Hello Worlda");
    });
  });
});

describe("Annotation and storage", () => {
  describe("issue14023.pdf", () => {
    before(() => {
      cy.visit(`/${P_html}?${queriesFrom("issue14023.pdf")}`);
    });

    it("must let checkboxes with the same name behave like radio buttons", () => {
      const text1 = "hello world!";
      const text2 = "!dlrow olleh";
      // Text field.
      cy.get(getSelector("64R")).type(text1);
      // Checkbox.
      cy.get("[data-annotation-id='65R']").click();
      // Radio.
      cy.get("[data-annotation-id='67R']").click();

      for (
        const [pageNumber, textId, checkId, radio1Id, radio2Id] of [
          [2, "18R", "19R", "21R", "20R"],
          [5, "23R", "24R", "22R", "25R"],
        ] as const
      ) {
        cy.get(`[data-page-number="${pageNumber}"][class="page"]`).then(
          (jel) => jel[0].scrollIntoView(),
        );

        cy.get(getSelector(textId)).should("have.value", text1);
        cy.get(getSelector(checkId)).should("be.checked");
        cy.get(getSelector(radio1Id)).should("not.be.checked");
        cy.get(getSelector(radio2Id)).should("not.be.checked");
      }

      // Change data on page 5 and check that other pages changed.
      // Text field.
      cy.get(getSelector("23R")).type(text2);
      // Checkbox.
      cy.get("[data-annotation-id='24R']").click();
      // Radio.
      cy.get("[data-annotation-id='25R']").click();

      for (
        const [pageNumber, textId, checkId, radio1Id, radio2Id] of [
          [1, "64R", "65R", "67R", "68R"],
          [2, "18R", "19R", "21R", "20R"],
        ] as const
      ) {
        cy.get(`[data-page-number="${pageNumber}"][class="page"]`).then(
          (jel) => jel[0].scrollIntoView(),
        );

        // cy.get(getSelector(textId)).should("have.value", text2 + text1);
        cy.get(getSelector(textId)).should("have.value", text1 + text2);
        cy.get(getSelector(checkId)).should("not.be.checked");
        cy.get(getSelector(radio1Id)).should("not.be.checked");
        cy.get(getSelector(radio2Id)).should("not.be.checked");
      }
    });
  });
});

describe("ResetForm action", () => {
  describe("resetform.pdf", () => {
    beforeEach(() => {
      cy.visit(`/${P_html}?${queriesFrom("resetform.pdf")}`);
    });

    it("must reset all fields", () => {
      const base = "hello world";
      for (let i = 63; i <= 67; i++) {
        cy.get(getSelector(`${i}R`)).type(base);
      }

      const selectors = [69, 71, 75].map((n) => `[data-annotation-id='${n}R']`);
      for (const selector of selectors) {
        cy.get(selector).click();
      }

      cy.get(getSelector("78R")).select("b");
      cy.get(getSelector("81R")).select("f");

      cy.get("[data-annotation-id='82R']").click();
      cy.get(getSelector("63R")).should("have.value", "");

      for (let i = 63; i <= 68; i++) {
        cy.get(getSelector(`${i}R`)).should("have.value", "");
      }

      const ids = [69, 71, 72, 73, 74, 75, 76, 77];
      for (const id of ids) {
        cy.get(getSelector(`${id}R`)).should("not.be.checked");
      }

      cy.get(`${getSelector("78R")} [value="a"]`).should("be.selected");
      cy.get(`${getSelector("81R")} [value="d"]`).should("be.selected");
    });

    it("must reset some fields", () => {
      const base = "hello world";
      for (let i = 63; i <= 68; i++) {
        cy.get(getSelector(`${i}R`)).type(base);
      }

      const selectors = [69, 71, 72, 73, 75].map((n) =>
        `[data-annotation-id='${n}R']`
      );
      for (const selector of selectors) {
        cy.get(selector).click();
      }

      cy.get(getSelector("78R")).select("b");
      cy.get(getSelector("81R")).select("f");

      cy.get("[data-annotation-id='84R']").click();
      cy.get(getSelector("63R")).should("have.value", "");

      for (let i = 63; i <= 68; i++) {
        const expected = (i - 3) % 2 === 0 ? "" : base;
        cy.get(getSelector(`${i}R`)).should("have.value", expected);
      }

      let ids = [69, 72, 73, 74, 76, 77];
      for (const id of ids) {
        cy.get(getSelector(`${id}R`)).should("not.be.checked");
      }

      ids = [71, 75];
      for (const id of ids) {
        cy.get(getSelector(`${id}R`)).should("be.checked");
      }

      cy.get(`${getSelector("78R")} [value="a"]`).should("be.selected");
      cy.get(`${getSelector("81R")} [value="f"]`).should("be.selected");
    });
  });

  describe("FreeText widget", () => {
    describe("issue14438.pdf", () => {
      before(() => {
        cy.visit(`/${P_html}?${queriesFrom("issue14438.pdf")}`);
      });

      it("must check that the FreeText annotation has a popup", () => {
        cy.get("[data-annotation-id='10R']").click()
          .should("not.be.hidden");
      });
    });
  });

  describe("Ink widget and its popup after editing", () => {
    describe("annotation-caret-ink.pdf", () => {
      before(() => {
        cy.visit(`/${P_html}?${queriesFrom("annotation-caret-ink.pdf")}`);
      });

      it.skip("must check that the Ink annotation has a popup", () => {
        // if (browserName) {
        //   // TODO
        //   pending(
        //     "Re-enable this test when the Ink annotation has been made editable.",
        //   );
        //   return;
        // }

        cy.get("[data-annotation-id='25R']").should("not.be.hidden");
        cy.get("#editorFreeText").click();
        cy.get("[data-annotation-id='25R']").should("be.hidden");
        cy.get("#editorFreeText").click();
        cy.get("[data-annotation-id='25R']").should("not.be.hidden");
      });
    });
  });

  describe("Don't use AP when /NeedAppearances is true", () => {
    describe("bug1844583.pdf", () => {
      before(() => {
        cy.visit(`/${P_html}?${queriesFrom("bug1844583.pdf")}`);
      });

      it("must check the content of the text field", () => {
        cy.get(getSelector("8R")).should("have.value", "Hello World");
      });
    });
  });

  describe("Toggle popup with keyboard", () => {
    describe("tagged_stamp.pdf", () => {
      before(() => {
        cy.visit(`/${P_html}?${queriesFrom("tagged_stamp.pdf")}`);
      });

      it("must check that the popup has the correct visibility", () => {
        cy.get("[data-annotation-id='21R']").as("21R")
          .should("be.hidden");
        cy.get("[data-annotation-id='20R']").as("20R")
          .focus().type("{Enter}");
        cy.get("@21R").should("not.be.hidden");

        cy.get("@20R").type("{Enter}");
        cy.get("@21R").should("be.hidden");

        cy.get("@20R").type("{Enter}");
        cy.get("@21R").should("not.be.hidden");

        cy.get("@20R").type("{Esc}");
        cy.get("@21R").should("be.hidden");
      });
    });
  });
});
/*80--------------------------------------------------------------------------*/
