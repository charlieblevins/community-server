"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifiedMetadataWriter = void 0;
const Conditions_1 = require("../../../storage/Conditions");
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const Vocabularies_1 = require("../../../util/Vocabularies");
const MetadataWriter_1 = require("./MetadataWriter");
/**
 * A {@link MetadataWriter} that generates all the necessary headers related to the modification date of a resource.
 */
class ModifiedMetadataWriter extends MetadataWriter_1.MetadataWriter {
    async handle(input) {
        const modified = input.metadata.get(Vocabularies_1.DC.terms.modified);
        if (modified) {
            const date = new Date(modified.value);
            HeaderUtil_1.addHeader(input.response, 'Last-Modified', date.toUTCString());
        }
        const etag = Conditions_1.getETag(input.metadata);
        if (etag) {
            HeaderUtil_1.addHeader(input.response, 'ETag', etag);
        }
    }
}
exports.ModifiedMetadataWriter = ModifiedMetadataWriter;
//# sourceMappingURL=ModifiedMetadataWriter.js.map