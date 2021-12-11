"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertingErrorHandler = void 0;
const ContentTypes_1 = require("../../../util/ContentTypes");
const HttpErrorUtil_1 = require("../../../util/errors/HttpErrorUtil");
const TermUtil_1 = require("../../../util/TermUtil");
const Vocabularies_1 = require("../../../util/Vocabularies");
const BasicRepresentation_1 = require("../../representation/BasicRepresentation");
const RepresentationMetadata_1 = require("../../representation/RepresentationMetadata");
const ErrorHandler_1 = require("./ErrorHandler");
/**
 * Converts an error into a Representation of content type internal/error.
 * Then feeds that representation into its converter to create a representation based on the given preferences.
 */
class ConvertingErrorHandler extends ErrorHandler_1.ErrorHandler {
    constructor(converter, showStackTrace = false) {
        super();
        this.converter = converter;
        this.showStackTrace = showStackTrace;
    }
    async canHandle(input) {
        const { conversionArgs } = this.prepareArguments(input);
        await this.converter.canHandle(conversionArgs);
    }
    async handle(input) {
        const { statusCode, conversionArgs } = this.prepareArguments(input);
        const converted = await this.converter.handle(conversionArgs);
        return this.createResponse(statusCode, converted);
    }
    async handleSafe(input) {
        const { statusCode, conversionArgs } = this.prepareArguments(input);
        const converted = await this.converter.handleSafe(conversionArgs);
        return this.createResponse(statusCode, converted);
    }
    /**
     * Prepares the arguments used by all functions.
     */
    prepareArguments({ error, preferences }) {
        const statusCode = HttpErrorUtil_1.getStatusCode(error);
        const representation = this.toRepresentation(error, statusCode);
        const identifier = { path: representation.metadata.identifier.value };
        return { statusCode, conversionArgs: { identifier, representation, preferences } };
    }
    /**
     * Creates a ResponseDescription based on the Representation.
     */
    createResponse(statusCode, converted) {
        return {
            statusCode,
            metadata: converted.metadata,
            data: converted.data,
        };
    }
    /**
     * Creates a Representation based on the given error.
     * Content type will be internal/error.
     * The status code is used for metadata.
     */
    toRepresentation(error, statusCode) {
        const metadata = new RepresentationMetadata_1.RepresentationMetadata(ContentTypes_1.INTERNAL_ERROR);
        metadata.add(Vocabularies_1.HTTP.terms.statusCodeNumber, TermUtil_1.toLiteral(statusCode, Vocabularies_1.XSD.terms.integer));
        if (!this.showStackTrace) {
            delete error.stack;
        }
        return new BasicRepresentation_1.BasicRepresentation([error], metadata, false);
    }
}
exports.ConvertingErrorHandler = ConvertingErrorHandler;
//# sourceMappingURL=ConvertingErrorHandler.js.map