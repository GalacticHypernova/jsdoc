import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "pathe";
export const files = new Map<string, string>();


/**
 * A utility function to cache file contents to avoid duplicate FS operations.
 * @param modulePath The module path
 */
export function cacheFile(modulePath: string) {
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
      // This is a nested dep directory
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
    return modulePath;
}

/**
* A utility for extracting the JSDoc annotations from a member in the given module, if it exists.
  @param modulePath - The path to the module containing the function.
  @param member - The name of the member to extract the JSDoc annotations from.
  @returns The JSDoc annotations for the given function, if it exists.
  @throws {Error} if something went wrong
*/
export function extractJSDoc(modulePath: string, member: string) {
  try {
    modulePath = cacheFile(modulePath)
    const jsDocRE = new RegExp(
      `(\\/\\*\\*[\\s\\S]*\\*\\/)\\s*(?:\n[^\\n]*${member})`,
      "i",
    );
    const jsDoc = files.get(modulePath)?.match(jsDocRE);
    return jsDoc;
  } catch (error) {
    throw new Error("[UnJSDoc] Error during extraction of JSDoc: " + error);
  }
}

/**
 * A utility for adding JSDoc to a module
 * @param modulePath The module to add JSDoc to
 * @param member the specific member to add JSDoc to
 * @param opts {JSDocOptions} The options
 * @returns void
 */
export function addJSDoc(modulePath: string, member: string){}

export function generateJSDocs<T>(modulePath: string, member: T) {
  modulePath = cacheFile(modulePath)
  let jsDoc = `/**`
  if(typeof member === "function") {
    jsDoc+=`\n * ${member.name}`
    const functionNameRE = new RegExp(`function\\s+${member.name}\\(([^)]*)\\)`, "i");
    const match = files.get(modulePath)?.match(functionNameRE)
    if(match) {
      const params = match[1].split(",").map(param => param.trim()).map(param => [param.split(':')[0].trim(), param.split(':')[1]?.trim()??''])
      for (const param of params){
        jsDoc+=`\n * @param ${param[0]} {${param[1]||'unknown'}} - `
      }
      console.log("hi")
      jsDoc+="\n*/"
      return jsDoc;
    }
  }
}

