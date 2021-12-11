"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allFulfilled = exports.promiseSome = void 0;
const HttpErrorUtil_1 = require("./errors/HttpErrorUtil");
// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() { }
/**
 * A function that simulates the Array.some behaviour but on an array of Promises.
 * Returns true if at least one promise returns true.
 * Returns false if all promises return false or error.
 *
 * @remarks
 *
 * Predicates provided as input must be implemented considering
 * the following points:
 * 1. if they throw an error, it won't be propagated;
 * 2. throwing an error should be logically equivalent to returning false.
 */
async function promiseSome(predicates) {
    return new Promise((resolve) => {
        function resolveIfTrue(value) {
            if (value) {
                resolve(true);
            }
        }
        Promise.all(predicates.map((predicate) => predicate.then(resolveIfTrue, noop)))
            .then(() => resolve(false), noop);
    });
}
exports.promiseSome = promiseSome;
/**
 * Obtains the values of all fulfilled promises.
 * If there are rejections (and `ignoreErrors` is false), throws a combined error of all rejected promises.
 */
async function allFulfilled(promises, ignoreErrors = false) {
    // Collect values and errors
    const values = [];
    const errors = [];
    for (const result of await Promise.allSettled(promises)) {
        if (result.status === 'fulfilled') {
            values.push(result.value);
        }
        else if (!ignoreErrors) {
            errors.push(result.reason);
        }
    }
    // Either throw or return
    if (errors.length > 0) {
        throw HttpErrorUtil_1.createAggregateError(errors);
    }
    return values;
}
exports.allFulfilled = allFulfilled;
//# sourceMappingURL=PromiseUtil.js.map