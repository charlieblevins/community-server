"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicJsonToTemplateConverter = void 0;
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const RepresentationMetadata_1 = require("../../http/representation/RepresentationMetadata");
const ContentTypes_1 = require("../../util/ContentTypes");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const StreamUtil_1 = require("../../util/StreamUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
const ConversionUtil_1 = require("./ConversionUtil");
const RepresentationConverter_1 = require("./RepresentationConverter");
/**
 * Converts JSON data by using it as input parameters for rendering a template.
 * The `extension` field can be used to only support a specific type of templates,
 * such as ".ejs" for EJS templates.
 *
 * To find the templates it expects the Representation metadata to contain `SOLID_META.template` triples,
 * with the objects being the template paths.
 * For each of those templates there also needs to be a CONTENT_TYPE triple
 * describing the content-type of that template.
 *
 * The output of the result depends on the content-type matched with the template.
 */
class DynamicJsonToTemplateConverter extends RepresentationConverter_1.RepresentationConverter {
    constructor(templateEngine) {
        super();
        this.templateEngine = templateEngine;
    }
    async canHandle(input) {
        if (input.representation.metadata.contentType !== ContentTypes_1.APPLICATION_JSON) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Only JSON data is supported');
        }
        const { identifier, representation, preferences } = input;
        // Can only handle this input if we can find a type to convert to
        const typeMap = this.constructTypeMap(identifier, representation);
        this.findType(typeMap, preferences.type);
    }
    async handle(input) {
        const { identifier, representation, preferences } = input;
        const typeMap = this.constructTypeMap(identifier, representation);
        const type = this.findType(typeMap, preferences.type);
        const json = JSON.parse(await StreamUtil_1.readableToString(representation.data));
        const rendered = await this.templateEngine.render(json, { templateFile: typeMap[type] });
        const metadata = new RepresentationMetadata_1.RepresentationMetadata(representation.metadata, { [Vocabularies_1.CONTENT_TYPE]: type });
        return new BasicRepresentation_1.BasicRepresentation(rendered, metadata);
    }
    /**
     * Uses the metadata of the Representation to create a map where each key is a content-type
     * and each value is the path of the corresponding template.
     */
    constructTypeMap(identifier, representation) {
        // Finds the templates in the metadata
        const templates = representation.metadata.quads(identifier.path, Vocabularies_1.SOLID_META.terms.template)
            .map((quad) => quad.object)
            .filter((term) => term.termType === 'NamedNode');
        // Maps all content-types to their template
        const typeMap = {};
        for (const template of templates) {
            const types = representation.metadata.quads(template, Vocabularies_1.CONTENT_TYPE_TERM).map((quad) => quad.object.value);
            for (const type of types) {
                typeMap[type] = template.value;
            }
        }
        return typeMap;
    }
    /**
     * Finds the best content-type to convert to based on the provided templates and preferences.
     */
    findType(typeMap, typePreferences = {}) {
        const typeWeights = Object.fromEntries(Object.keys(typeMap).map((type) => [type, 1]));
        const type = ConversionUtil_1.getConversionTarget(typeWeights, typePreferences);
        if (!type) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`No templates found matching ${Object.keys(typePreferences)}, only ${Object.keys(typeMap)}`);
        }
        return type;
    }
}
exports.DynamicJsonToTemplateConverter = DynamicJsonToTemplateConverter;
//# sourceMappingURL=DynamicJsonToTemplateConverter.js.map