"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeErrorHandler = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const ErrorUtil_1 = require("../../../util/errors/ErrorUtil");
const HttpErrorUtil_1 = require("../../../util/errors/HttpErrorUtil");
const StreamUtil_1 = require("../../../util/StreamUtil");
const TermUtil_1 = require("../../../util/TermUtil");
const Vocabularies_1 = require("../../../util/Vocabularies");
const RepresentationMetadata_1 = require("../../representation/RepresentationMetadata");
const ErrorHandler_1 = require("./ErrorHandler");
/**
 * Returns a simple text description of an error.
 * This class is a failsafe in case the wrapped error handler fails.
 */
class SafeErrorHandler extends ErrorHandler_1.ErrorHandler {
    constructor(errorHandler, showStackTrace = false) {
        super();
        this.logger = LogUtil_1.getLoggerFor(this);
        this.errorHandler = errorHandler;
        this.showStackTrace = showStackTrace;
    }
    async handle(input) {
        try {
            return await this.errorHandler.handleSafe(input);
        }
        catch (error) {
            this.logger.debug(`Recovering from error handler failure: ${ErrorUtil_1.createErrorMessage(error)}`);
        }
        const { error } = input;
        const statusCode = HttpErrorUtil_1.getStatusCode(error);
        const metadata = new RepresentationMetadata_1.RepresentationMetadata('text/plain');
        metadata.add(Vocabularies_1.HTTP.terms.statusCodeNumber, TermUtil_1.toLiteral(statusCode, Vocabularies_1.XSD.terms.integer));
        const text = typeof error.stack === 'string' && this.showStackTrace ?
            `${error.stack}\n` :
            `${error.name}: ${error.message}\n`;
        return {
            statusCode,
            metadata,
            data: StreamUtil_1.guardedStreamFrom(text),
        };
    }
}
exports.SafeErrorHandler = SafeErrorHandler;
//# sourceMappingURL=SafeErrorHandler.js.map