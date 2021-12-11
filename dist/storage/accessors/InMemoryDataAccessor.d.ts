/// <reference types="node" />
import type { Readable } from 'stream';
import { RepresentationMetadata } from '../../http/representation/RepresentationMetadata';
import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { Guarded } from '../../util/GuardedStream';
import type { IdentifierStrategy } from '../../util/identifiers/IdentifierStrategy';
import type { DataAccessor } from './DataAccessor';
export declare class InMemoryDataAccessor implements DataAccessor {
    private readonly identifierStrategy;
    private readonly store;
    constructor(identifierStrategy: IdentifierStrategy);
    canHandle(): Promise<void>;
    getData(identifier: ResourceIdentifier): Promise<Guarded<Readable>>;
    getMetadata(identifier: ResourceIdentifier): Promise<RepresentationMetadata>;
    getChildren(identifier: ResourceIdentifier): AsyncIterableIterator<RepresentationMetadata>;
    writeDocument(identifier: ResourceIdentifier, data: Guarded<Readable>, metadata: RepresentationMetadata): Promise<void>;
    writeContainer(identifier: ResourceIdentifier, metadata: RepresentationMetadata): Promise<void>;
    deleteResource(identifier: ResourceIdentifier): Promise<void>;
    private isDataEntry;
    /**
     * Generates an array of identifiers corresponding to the nested containers until the given identifier is reached.
     * This does not verify if these identifiers actually exist.
     */
    private getHierarchy;
    /**
     * Returns the ContainerEntry corresponding to the parent container of the given identifier.
     * Will throw 404 if the parent does not exist.
     */
    private getParentEntry;
    /**
     * Returns the CacheEntry corresponding the given identifier.
     * Will throw 404 if the resource does not exist.
     */
    private getEntry;
}
