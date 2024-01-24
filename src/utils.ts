import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "pathe";
export const files = new Map<string, string>();

/**
* A utility for extracting the JSDoc annotations from a member in the given module, if it exists.
  @param modulePath - The path to the module containing the function.
  @param member - The name of the member to extract the JSDoc annotations from.
  @returns The JSDoc annotations for the given function, if it exists.
  @throws {Error} if something went wrong
*/
export function extractJSDoc(modulePath: string, member: string) {
  try {
    const jsDocRE = new RegExp(
      `(\\/\\*\\*[\\s\\S]*\\*\\/)\\s*(?:\n[^\\n]*${member})`,
      "i",
    );
    modulePath = resolve(modulePath.replaceAll("../", ""));
    // We want to cache the files to avoid duplicate lookups
    if (!files.has(modulePath)) {
      // This is a top level dep directory (example: h3), which is why it has package.json
      if (existsSync(modulePath + "/package.json")) {
        const pkg = JSON.parse(
          readFileSync(modulePath + "/package.json", "utf8"),
        );
        files.set(
          modulePath,
          readFileSync(modulePath + "/" + pkg.main, "utf8"),
        );
      }
      // This is a nested dep directory (example: h3/core)
      else {
        if (statSync(modulePath).isDirectory()) {
          modulePath = modulePath + "/index";
        }
        for (const ext of [".ts", ".js", ".mjs", ".cjs"]) {
          if (existsSync(modulePath + ext)) {
            files.set(modulePath, readFileSync(modulePath + ext, "utf8"));
            break;
          }
        }
      }
    }
    const jsDoc = files.get(modulePath)?.match(jsDocRE);
    return jsDoc;
  } catch (error) {
    throw new Error("[UnJSDoc] Error during extraction of JSDoc: " + error);
  }
}
