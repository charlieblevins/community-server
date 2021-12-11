"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerToTemplateConverter = void 0;
const lodash_orderby_1 = __importDefault(require("lodash.orderby"));
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const ContentTypes_1 = require("../../util/ContentTypes");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const PathUtil_1 = require("../../util/PathUtil");
const StreamUtil_1 = require("../../util/StreamUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
const TypedRepresentationConverter_1 = require("./TypedRepresentationConverter");
/**
 * A {@link RepresentationConverter} that creates a templated representation of a container.
 */
class ContainerToTemplateConverter extends TypedRepresentationConverter_1.TypedRepresentationConverter {
    constructor(templateEngine, contentType, identifierStrategy) {
        super(ContentTypes_1.INTERNAL_QUADS, contentType);
        this.templateEngine = templateEngine;
        this.contentType = contentType;
        this.identifierStrategy = identifierStrategy;
    }
    async canHandle(args) {
        if (!PathUtil_1.isContainerIdentifier(args.identifier)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Can only convert containers.');
        }
        await super.canHandle(args);
    }
    async handle({ identifier, representation }) {
        const rendered = await this.templateEngine.render({
            identifier: identifier.path,
            name: this.getLocalName(identifier.path),
            container: true,
            children: await this.getChildResources(identifier, representation.data),
            parents: this.getParentContainers(identifier),
        });
        return new BasicRepresentation_1.BasicRepresentation(rendered, representation.metadata, this.contentType);
    }
    /**
     * Collects the children of the container as simple objects.
     */
    async getChildResources(container, quads) {
        // Collect the needed bits of information from the containment triples
        const resources = new Set();
        quads.on('data', ({ subject, predicate, object }) => {
            if (subject.value === container.path && predicate.equals(Vocabularies_1.LDP.terms.contains)) {
                resources.add(object.value);
            }
        });
        await StreamUtil_1.endOfStream(quads);
        // Create a simplified object for every resource
        const children = [...resources].map((resource) => ({
            identifier: resource,
            name: this.getLocalName(resource),
            container: PathUtil_1.isContainerPath(resource),
        }));
        // Sort the resulting list
        return lodash_orderby_1.default(children, ['container', 'identifier'], ['desc', 'asc']);
    }
    /**
     * Collects the ancestors of the container as simple objects.
     */
    getParentContainers(container) {
        const parents = [];
        let current = container;
        while (!this.identifierStrategy.isRootContainer(current)) {
            current = this.identifierStrategy.getParentContainer(current);
            parents.push({
                identifier: current.path,
                name: this.getLocalName(current.path),
                container: true,
            });
        }
        return parents.reverse();
    }
    /**
     * Derives a short name for the given resource.
     */
    getLocalName(iri) {
        var _a;
        const match = /:\/+([^/]+).*?\/([^/]*)\/?$/u.exec(iri);
        return (match === null || match === void 0 ? void 0 : match[2]) ? decodeURIComponent(match[2]) : (_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0 ? _a : iri;
    }
}
exports.ContainerToTemplateConverter = ContainerToTemplateConverter;
//# sourceMappingURL=ContainerToTemplateConverter.js.map