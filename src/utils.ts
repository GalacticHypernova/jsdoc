import { readFileSync, existsSync, statSync } from "node:fs"
import { resolve } from 'pathe'
export const files = new Map<string, string>();

/**
* A utility for extracting the JSDoc annotations from a function in the given module, if it exists.
  @param modulePath - The path to the module containing the function.
  @param functionName - The name of the function to extract the JSDoc annotations from.
  @returns The JSDoc annotations for the given function, if it exists.
  @throws {Error} if something went wrong
*/
export function extractJSDoc(modulePath: string, functionName: string) {
  try {
    const jsDocRE = new RegExp(`(\\/\\*\\*[\\s\\S]*\\*\\/)\\s*(?:\n[^\\n]*${functionName})`,'i')
    modulePath = resolve(modulePath.replaceAll('../',""))
    if (!files.has(modulePath)) {
      if (existsSync(modulePath + "/package.json")) {
        const pkg = JSON.parse(readFileSync(modulePath + "/package.json", "utf8"))
        files.set(modulePath, readFileSync(modulePath + "/" + pkg.main, "utf8"))
      }
      else {
        if(statSync(modulePath).isDirectory()) { modulePath = modulePath+"/index" }
        console.log(modulePath)
        for (const ext of [".ts",".js",".mjs",".cjs"]) {
          console.log("hi")
          if (existsSync(modulePath + ext)) {
            files.set(modulePath, readFileSync(modulePath+ext, "utf8"))
            break
          }
        }
      }
    }
    console.log(files, modulePath, jsDocRE)
    const jsDoc = files.get(modulePath)?.match(jsDocRE)
    return jsDoc;
  }
  catch (error) {
    throw new Error("[UnJSDoc] Error during extraction of JSDoc: "+ error)
  }
}