/// <reference types="node" />
import type { Readable } from 'stream';
import type { Guarded } from '../../util/GuardedStream';
import type { Representation } from './Representation';
import type { MetadataIdentifier, MetadataRecord } from './RepresentationMetadata';
import { RepresentationMetadata } from './RepresentationMetadata';
/**
 * Class with various constructors to facilitate creating a representation.
 *
 * A representation consists of 1) data, 2) metadata, and 3) a binary flag
 * to indicate whether the data is a binary stream or an object stream.
 *
 * 1. The data can be given as a stream, array, or string.
 * 2. The metadata can be specified as one or two parameters
 *    that will be passed to the {@link RepresentationMetadata} constructor.
 * 3. The binary field is optional, and if not specified,
 *    is determined from the content type inside the metadata.
 */
export declare class BasicRepresentation implements Representation {
    readonly data: Guarded<Readable>;
    readonly metadata: RepresentationMetadata;
    readonly binary: boolean;
    /**
     * An empty Representation
     */
    constructor();
    /**
     * @param data - The representation data
     * @param metadata - The representation metadata
     * @param binary - Whether the representation is a binary or object stream
     */
    constructor(data: Guarded<Readable> | Readable | any[] | string, metadata: RepresentationMetadata | MetadataRecord, binary?: boolean);
    /**
     * @param data - The representation data
     * @param metadata - The representation metadata
     * @param contentType - The representation's content type
     * @param binary - Whether the representation is a binary or object stream
     */
    constructor(data: Guarded<Readable> | Readable | any[] | string, metadata: RepresentationMetadata | MetadataRecord, contentType?: string, binary?: boolean);
    /**
     * @param data - The representation data
     * @param contentType - The representation's content type
     * @param binary - Whether the representation is a binary or object stream
     */
    constructor(data: Guarded<Readable> | Readable | any[] | string, contentType: string, binary?: boolean);
    /**
     * @param data - The representation data
     * @param identifier - The representation's identifier
     * @param metadata - The representation metadata
     * @param binary - Whether the representation is a binary or object stream
     */
    constructor(data: Guarded<Readable> | Readable | any[] | string, identifier: MetadataIdentifier, metadata?: MetadataRecord, binary?: boolean);
    /**
     * @param data - The representation data
     * @param identifier - The representation's identifier
     * @param contentType - The representation's content type
     * @param binary - Whether the representation is a binary or object stream
     */
    constructor(data: Guarded<Readable> | Readable | any[] | string, identifier: MetadataIdentifier, contentType?: string, binary?: boolean);
    /**
     * Data should only be interpreted if there is a content type.
     */
    get isEmpty(): boolean;
}
