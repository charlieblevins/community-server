"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterHandlers = exports.findHandler = void 0;
const ErrorUtil_1 = require("../errors/ErrorUtil");
const HttpErrorUtil_1 = require("../errors/HttpErrorUtil");
/**
 * Finds a handler that can handle the given input data.
 * Otherwise an error gets thrown.
 *
 * @param handlers - List of handlers to search in.
 * @param input - The input data.
 *
 * @returns A promise resolving to a handler that supports the data or otherwise rejecting.
 */
async function findHandler(handlers, input) {
    const errors = [];
    for (const handler of handlers) {
        try {
            await handler.canHandle(input);
            return handler;
        }
        catch (error) {
            if (ErrorUtil_1.isError(error)) {
                errors.push(error);
            }
            else {
                errors.push(new Error(ErrorUtil_1.createErrorMessage(error)));
            }
        }
    }
    throw HttpErrorUtil_1.createAggregateError(errors);
}
exports.findHandler = findHandler;
/**
 * Filters a list of handlers to only keep those that can handle the input.
 * Will error if no matching handlers are found.
 *
 * @param handlers - Handlers to filter.
 * @param input - Input that needs to be supported.
 */
async function filterHandlers(handlers, input) {
    const results = await Promise.allSettled(handlers.map(async (handler) => {
        await handler.canHandle(input);
        return handler;
    }));
    const matches = results.filter(({ status }) => status === 'fulfilled')
        .map((result) => result.value);
    if (matches.length > 0) {
        return matches;
    }
    // Generate error in case no matches were found
    const errors = results.map((result) => result.reason);
    throw HttpErrorUtil_1.createAggregateError(errors);
}
exports.filterHandlers = filterHandlers;
//# sourceMappingURL=HandlerUtil.js.map