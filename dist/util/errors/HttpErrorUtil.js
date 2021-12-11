"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAggregateError = exports.getStatusCode = void 0;
const BadRequestHttpError_1 = require("./BadRequestHttpError");
const ErrorUtil_1 = require("./ErrorUtil");
const HttpError_1 = require("./HttpError");
const InternalServerError_1 = require("./InternalServerError");
/**
 * Returns the HTTP status code corresponding to the error.
 */
function getStatusCode(error) {
    return HttpError_1.HttpError.isInstance(error) ? error.statusCode : 500;
}
exports.getStatusCode = getStatusCode;
/**
 * Combines a list of errors into a single HttpErrors.
 * Status code depends on the input errors. If they all share the same status code that code will be re-used.
 * If they are all within the 4xx range, 400 will be used, otherwise 500.
 *
 * @param errors - Errors to combine.
 * @param messagePrefix - Prefix for the aggregate error message. Will be followed with an array of all the messages.
 */
function createAggregateError(errors, messagePrefix = 'No handler supports the given input:') {
    const httpErrors = errors.map((error) => HttpError_1.HttpError.isInstance(error) ? error : new InternalServerError_1.InternalServerError(ErrorUtil_1.createErrorMessage(error)));
    const joined = httpErrors.map((error) => error.message).join(', ');
    const message = `${messagePrefix} [${joined}]`;
    // Check if all errors have the same status code
    if (httpErrors.length > 0 && httpErrors.every((error) => error.statusCode === httpErrors[0].statusCode)) {
        return new HttpError_1.HttpError(httpErrors[0].statusCode, httpErrors[0].name, message);
    }
    // Find the error range (4xx or 5xx)
    if (httpErrors.some((error) => error.statusCode >= 500)) {
        return new InternalServerError_1.InternalServerError(message);
    }
    return new BadRequestHttpError_1.BadRequestHttpError(message);
}
exports.createAggregateError = createAggregateError;
//# sourceMappingURL=HttpErrorUtil.js.map