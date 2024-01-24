import {  relative, resolve } from 'pathe'
import { readFileSync, existsSync } from "node:fs"
const files = new Map<string, string>();

/**
* A utility for extracting the JSDoc annotations from a function in the given module, if it exists.
*/
export function extractJSDoc(modulePath: string, functionName: string) {
  try {
    const jsDocRE = new RegExp(`(\\/\\*\\*[?;,.:\/@\\-\\s\\w\\{\\}\\[\\]\\(\\)\\<\\>\\"\`\|*]*\\*\\/)(?:\nexport d?e?c?l?a?r?e? (?:function|const) ${functionName})`,'i')
    modulePath = resolve(modulePath.slice(6))
    if (!files.has(modulePath)) {
      if (existsSync(modulePath + "/package.json")) {
        const pkg = JSON.parse(readFileSync(modulePath + "/package.json", "utf8"))
        files.set(modulePath, readFileSync(modulePath + "/" + pkg.main, "utf8"))
      }
      else {
        for (const ext of [".ts",".js",".mjs",".cjs"]) {
          if (existsSync(modulePath + ext)) {
            files.set(modulePath, readFileSync(modulePath+ext, "utf8"))
            break
          }
        }
      }
    }
    const jsDoc = files.get(modulePath)?.match(jsDocRE)
    return jsDoc;
  }
  catch (err) {
    throw new Error(err)
  }
}
