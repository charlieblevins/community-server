"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryDataAccessor = void 0;
const arrayify_stream_1 = __importDefault(require("arrayify-stream"));
const RepresentationMetadata_1 = require("../../http/representation/RepresentationMetadata");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
const NotFoundHttpError_1 = require("../../util/errors/NotFoundHttpError");
const StreamUtil_1 = require("../../util/StreamUtil");
class InMemoryDataAccessor {
    constructor(identifierStrategy) {
        this.identifierStrategy = identifierStrategy;
        this.store = { entries: {} };
    }
    async canHandle() {
        // All data is supported since streams never get read, only copied
    }
    async getData(identifier) {
        const entry = this.getEntry(identifier);
        if (!this.isDataEntry(entry)) {
            throw new NotFoundHttpError_1.NotFoundHttpError();
        }
        return StreamUtil_1.guardedStreamFrom(entry.data);
    }
    async getMetadata(identifier) {
        const entry = this.getEntry(identifier);
        return new RepresentationMetadata_1.RepresentationMetadata(entry.metadata);
    }
    async *getChildren(identifier) {
        const entry = this.getEntry(identifier);
        if (!this.isDataEntry(entry)) {
            const childNames = Object.keys(entry.entries);
            yield* childNames.map((name) => new RepresentationMetadata_1.RepresentationMetadata({ path: name }));
        }
    }
    async writeDocument(identifier, data, metadata) {
        const parent = this.getParentEntry(identifier);
        parent.entries[identifier.path] = {
            // Drain original stream and create copy
            data: await arrayify_stream_1.default(data),
            metadata,
        };
    }
    async writeContainer(identifier, metadata) {
        try {
            // Overwrite existing metadata but keep children if container already exists
            const entry = this.getEntry(identifier);
            entry.metadata = metadata;
        }
        catch (error) {
            // Create new entry if it didn't exist yet
            if (NotFoundHttpError_1.NotFoundHttpError.isInstance(error)) {
                const parent = this.getParentEntry(identifier);
                parent.entries[identifier.path] = {
                    entries: {},
                    metadata,
                };
            }
            else {
                throw error;
            }
        }
    }
    async deleteResource(identifier) {
        const parent = this.getParentEntry(identifier);
        if (!parent.entries[identifier.path]) {
            throw new NotFoundHttpError_1.NotFoundHttpError();
        }
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete parent.entries[identifier.path];
    }
    isDataEntry(entry) {
        return Boolean(entry.data);
    }
    /**
     * Generates an array of identifiers corresponding to the nested containers until the given identifier is reached.
     * This does not verify if these identifiers actually exist.
     */
    getHierarchy(identifier) {
        if (this.identifierStrategy.isRootContainer(identifier)) {
            return [identifier];
        }
        const hierarchy = this.getHierarchy(this.identifierStrategy.getParentContainer(identifier));
        hierarchy.push(identifier);
        return hierarchy;
    }
    /**
     * Returns the ContainerEntry corresponding to the parent container of the given identifier.
     * Will throw 404 if the parent does not exist.
     */
    getParentEntry(identifier) {
        // Casting is fine here as the parent should never be used as a real container
        let parent = this.store;
        if (this.identifierStrategy.isRootContainer(identifier)) {
            return parent;
        }
        const hierarchy = this.getHierarchy(this.identifierStrategy.getParentContainer(identifier));
        for (const entry of hierarchy) {
            parent = parent.entries[entry.path];
            if (!parent) {
                throw new NotFoundHttpError_1.NotFoundHttpError();
            }
            if (this.isDataEntry(parent)) {
                throw new InternalServerError_1.InternalServerError('Invalid path.');
            }
        }
        return parent;
    }
    /**
     * Returns the CacheEntry corresponding the given identifier.
     * Will throw 404 if the resource does not exist.
     */
    getEntry(identifier) {
        const parent = this.getParentEntry(identifier);
        const entry = parent.entries[identifier.path];
        if (!entry) {
            throw new NotFoundHttpError_1.NotFoundHttpError();
        }
        return entry;
    }
}
exports.InMemoryDataAccessor = InMemoryDataAccessor;
//# sourceMappingURL=InMemoryDataAccessor.js.map