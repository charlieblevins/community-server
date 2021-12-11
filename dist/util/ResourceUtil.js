"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneRepresentation = exports.addTemplateMetadata = exports.updateModifiedDate = exports.addResourceMetadata = void 0;
const arrayify_stream_1 = __importDefault(require("arrayify-stream"));
const n3_1 = require("n3");
const BasicRepresentation_1 = require("../http/representation/BasicRepresentation");
const RepresentationMetadata_1 = require("../http/representation/RepresentationMetadata");
const StreamUtil_1 = require("./StreamUtil");
const TermUtil_1 = require("./TermUtil");
const Vocabularies_1 = require("./Vocabularies");
var namedNode = n3_1.DataFactory.namedNode;
/**
 * Helper function to generate type quads for a Container or Resource.
 * @param metadata - Metadata to add to.
 * @param isContainer - If the identifier corresponds to a container.
 *
 * @returns The generated quads.
 */
function addResourceMetadata(metadata, isContainer) {
    if (isContainer) {
        metadata.add(Vocabularies_1.RDF.terms.type, Vocabularies_1.LDP.terms.Container);
        metadata.add(Vocabularies_1.RDF.terms.type, Vocabularies_1.LDP.terms.BasicContainer);
    }
    metadata.add(Vocabularies_1.RDF.terms.type, Vocabularies_1.LDP.terms.Resource);
}
exports.addResourceMetadata = addResourceMetadata;
/**
 * Updates the dc:modified time to the given time.
 * @param metadata - Metadata to update.
 * @param date - Last modified date. Defaults to current time.
 */
function updateModifiedDate(metadata, date = new Date()) {
    // Milliseconds get lost in some serializations, potentially causing mismatches
    const lastModified = new Date(date);
    lastModified.setMilliseconds(0);
    metadata.set(Vocabularies_1.DC.terms.modified, TermUtil_1.toLiteral(lastModified.toISOString(), Vocabularies_1.XSD.terms.dateTime));
}
exports.updateModifiedDate = updateModifiedDate;
/**
 * Links a template file with a given content-type to the metadata using the SOLID_META.template predicate.
 * @param metadata - Metadata to update.
 * @param templateFile - Path to the template.
 * @param contentType - Content-type of the template after it is rendered.
 */
function addTemplateMetadata(metadata, templateFile, contentType) {
    const templateNode = namedNode(templateFile);
    metadata.add(Vocabularies_1.SOLID_META.terms.template, templateNode);
    metadata.addQuad(templateNode, Vocabularies_1.CONTENT_TYPE_TERM, contentType);
}
exports.addTemplateMetadata = addTemplateMetadata;
/**
 * Helper function to clone a representation, the original representation can still be used.
 * This function loads the entire stream in memory.
 * @param representation - The representation to clone.
 *
 * @returns The cloned representation.
 */
async function cloneRepresentation(representation) {
    const data = await arrayify_stream_1.default(representation.data);
    const result = new BasicRepresentation_1.BasicRepresentation(data, new RepresentationMetadata_1.RepresentationMetadata(representation.metadata), representation.binary);
    representation.data = StreamUtil_1.guardedStreamFrom(data);
    return result;
}
exports.cloneRepresentation = cloneRepresentation;
//# sourceMappingURL=ResourceUtil.js.map