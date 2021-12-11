"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicResponseWriter = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const ConversionUtil_1 = require("../../storage/conversion/ConversionUtil");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const StreamUtil_1 = require("../../util/StreamUtil");
const ResponseWriter_1 = require("./ResponseWriter");
/**
 * Writes to an {@link HttpResponse} based on the incoming {@link ResponseDescription}.
 */
class BasicResponseWriter extends ResponseWriter_1.ResponseWriter {
    constructor(metadataWriter) {
        super();
        this.logger = LogUtil_1.getLoggerFor(this);
        this.metadataWriter = metadataWriter;
    }
    async canHandle(input) {
        var _a;
        const contentType = (_a = input.result.metadata) === null || _a === void 0 ? void 0 : _a.contentType;
        if (ConversionUtil_1.isInternalContentType(contentType)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Cannot serialize the internal content type ${contentType}`);
        }
    }
    async handle(input) {
        if (input.result.metadata) {
            await this.metadataWriter.handleSafe({ response: input.response, metadata: input.result.metadata });
        }
        input.response.writeHead(input.result.statusCode);
        if (input.result.data) {
            const pipe = StreamUtil_1.pipeSafely(input.result.data, input.response);
            pipe.on('error', (error) => {
                this.logger.error(`Writing to HttpResponse failed with message ${error.message}`);
            });
        }
        else {
            // If there is input data the response will end once the input stream ends
            input.response.end();
        }
    }
}
exports.BasicResponseWriter = BasicResponseWriter;
//# sourceMappingURL=BasicResponseWriter.js.map