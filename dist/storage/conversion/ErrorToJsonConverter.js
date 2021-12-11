"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorToJsonConverter = void 0;
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const ContentTypes_1 = require("../../util/ContentTypes");
const HttpError_1 = require("../../util/errors/HttpError");
const StreamUtil_1 = require("../../util/StreamUtil");
const TypedRepresentationConverter_1 = require("./TypedRepresentationConverter");
/**
 * Converts an Error object to JSON by copying its fields.
 */
class ErrorToJsonConverter extends TypedRepresentationConverter_1.TypedRepresentationConverter {
    constructor() {
        super(ContentTypes_1.INTERNAL_ERROR, ContentTypes_1.APPLICATION_JSON);
    }
    async handle({ representation }) {
        const error = await StreamUtil_1.getSingleItem(representation.data);
        const result = {
            name: error.name,
            message: error.message,
        };
        if (HttpError_1.HttpError.isInstance(error)) {
            result.statusCode = error.statusCode;
            result.errorCode = error.errorCode;
            if (error.details) {
                try {
                    // The details might not be serializable
                    JSON.stringify(error.details);
                    result.details = error.details;
                }
                catch {
                    // Do not store the details
                }
            }
        }
        else {
            result.statusCode = 500;
        }
        if (error.stack) {
            result.stack = error.stack;
        }
        // Update the content-type to JSON
        return new BasicRepresentation_1.BasicRepresentation(JSON.stringify(result), representation.metadata, ContentTypes_1.APPLICATION_JSON);
    }
}
exports.ErrorToJsonConverter = ErrorToJsonConverter;
//# sourceMappingURL=ErrorToJsonConverter.js.map