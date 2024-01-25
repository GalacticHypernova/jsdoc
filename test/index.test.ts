import { expect, it, describe } from "vitest";
import { extractJSDoc } from "../src";

describe("unjsdoc", () => {
  decribe("extractJSDoc", () => {
    it("should extract jsdoc", () => {
      const jsdoc = extractJSDoc("../playground", "hasJSDoc");
      expect(jsdoc[0]).toMatchSnapshot(`
          /**
           * Test function with JSDoc
           * @param test
           * @param test2
           * @returns {number}
           */`);
    });
    it("should return null for non-existent jsdoc", () => {
      const jsdoc = extractJSDoc("../playground", "noJSDoc");
      // eslint-disable-next-line unicorn/no-null
      expect(jsdoc).toEqual(null);
    });
    it("should return null for non-existent function", () => {
      const jsdoc = extractJSDoc("../playground", "noFunction");
      // eslint-disable-next-line unicorn/no-null
      expect(jsdoc).toEqual(null);
    });
  });
});
