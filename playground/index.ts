
/**
 * Test function with JSDoc
 * @param test
 * @param test2
 * @returns {number}
 */
export function hasJSDoc(test: number, test2: number) {
    return test + test2;
}

export function noJSDoc(test: number, test2) {
    return test + test2;
}



// Use these to prevent error

hasJSDoc(1,2);
noJSDoc(1,2);