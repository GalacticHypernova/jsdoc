export declare const files: Map<string, string>;
/**
* A utility for extracting the JSDoc annotations from a member in the given module, if it exists.
  @param modulePath - The path to the module containing the function.
  @param member - The name of the member to extract the JSDoc annotations from.
  @returns The JSDoc annotations for the given function, if it exists.
  @throws {Error} if something went wrong
*/
export declare function extractJSDoc(modulePath: string, member: string): RegExpMatchArray | null | undefined;
