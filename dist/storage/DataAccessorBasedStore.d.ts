import type { Term } from 'rdf-js';
import type { AuxiliaryStrategy } from '../http/auxiliary/AuxiliaryStrategy';
import type { Patch } from '../http/representation/Patch';
import type { Representation } from '../http/representation/Representation';
import type { RepresentationMetadata } from '../http/representation/RepresentationMetadata';
import type { ResourceIdentifier } from '../http/representation/ResourceIdentifier';
import type { IdentifierStrategy } from '../util/identifiers/IdentifierStrategy';
import type { DataAccessor } from './accessors/DataAccessor';
import type { Conditions } from './Conditions';
import type { ModifiedResource, ResourceStore } from './ResourceStore';
/**
 * ResourceStore which uses a DataAccessor for backend access.
 *
 * The DataAccessor interface provides elementary store operations such as read and write.
 * This DataAccessorBasedStore uses those elementary store operations
 * to implement the more high-level ResourceStore contact, abstracting all common functionality
 * such that new stores can be added by implementing the more simple DataAccessor contract.
 * DataAccessorBasedStore thereby provides behaviours for reuse across different stores, such as:
 *  * Converting container metadata to data
 *  * Converting slug to URI
 *  * Checking if addResource target is a container
 *  * Checking if no containment triples are written to a container
 *  * etc.
 *
 * Currently "metadata" is seen as something that is not directly accessible.
 * That means that a consumer can't write directly to the metadata of a resource, only indirectly through headers.
 * (Except for containers where data and metadata overlap).
 *
 * The one thing this store does not take care of (yet?) are containment triples for containers
 *
 * Work has been done to minimize the number of required calls to the DataAccessor,
 * but the main disadvantage is that sometimes multiple calls are required where a specific store might only need one.
 */
export declare class DataAccessorBasedStore implements ResourceStore {
    protected readonly logger: import("..").Logger;
    private readonly accessor;
    private readonly identifierStrategy;
    private readonly auxiliaryStrategy;
    constructor(accessor: DataAccessor, identifierStrategy: IdentifierStrategy, auxiliaryStrategy: AuxiliaryStrategy);
    resourceExists(identifier: ResourceIdentifier): Promise<boolean>;
    getRepresentation(identifier: ResourceIdentifier): Promise<Representation>;
    addResource(container: ResourceIdentifier, representation: Representation, conditions?: Conditions): Promise<ModifiedResource>;
    setRepresentation(identifier: ResourceIdentifier, representation: Representation, conditions?: Conditions): Promise<ModifiedResource[]>;
    modifyResource(identifier: ResourceIdentifier, patch: Patch, conditions?: Conditions): Promise<ModifiedResource[]>;
    deleteResource(identifier: ResourceIdentifier, conditions?: Conditions): Promise<ModifiedResource[]>;
    /**
     * Verify if the given identifier matches the stored base.
     */
    protected validateIdentifier(identifier: ResourceIdentifier): void;
    /**
     * Verify if the given metadata matches the conditions.
     */
    protected validateConditions(conditions?: Conditions, metadata?: RepresentationMetadata): void;
    /**
     * Returns the metadata matching the identifier, ignoring the presence of a trailing slash or not.
     *
     * Solid, §3.1: "If two URIs differ only in the trailing slash,
     * and the server has associated a resource with one of them,
     * then the other URI MUST NOT correspond to another resource."
     * https://solid.github.io/specification/protocol#uri-slash-semantics
     *
     * First the identifier gets requested and if no result is found
     * the identifier with differing trailing slash is requested.
     * @param identifier - Identifier that needs to be checked.
     */
    protected getNormalizedMetadata(identifier: ResourceIdentifier): Promise<RepresentationMetadata>;
    /**
     * Returns the result of `getNormalizedMetadata` or undefined if a 404 error is thrown.
     */
    protected getSafeNormalizedMetadata(identifier: ResourceIdentifier): Promise<RepresentationMetadata | undefined>;
    /**
     * Write the given resource to the DataAccessor. Metadata will be updated with necessary triples.
     * In case of containers `handleContainerData` will be used to verify the data.
     * @param identifier - Identifier of the resource.
     * @param representation - Corresponding Representation.
     * @param isContainer - Is the incoming resource a container?
     * @param createContainers - Should parent containers (potentially) be created?
     * @param exists - If the resource already exists.
     *
     * @returns Identifiers of resources that were possibly modified.
     */
    protected writeData(identifier: ResourceIdentifier, representation: Representation, isContainer: boolean, createContainers: boolean, exists: boolean): Promise<ModifiedResource[]>;
    /**
     * Verify if the incoming data for a container is valid (RDF and no containment triples).
     * Adds the container data to its metadata afterwards.
     *
     * @param representation - Container representation.
     */
    protected handleContainerData(representation: Representation): Promise<void>;
    /**
     * Removes all generated data from metadata to prevent it from being stored permanently.
     */
    protected removeResponseMetadata(metadata: RepresentationMetadata): void;
    /**
     * Updates the last modified date of the given container
     */
    protected updateContainerModifiedDate(container: ResourceIdentifier): Promise<void>;
    /**
     * Generates a new URI for a resource in the given container, potentially using the given slug.
     *
     * Solid, §5.3: "Servers MUST allow creating new resources with a POST request to URI path ending `/`.
     * Servers MUST create a resource with URI path ending `/{id}` in container `/`.
     * Servers MUST create a container with URI path ending `/{id}/` in container `/` for requests
     * including the HTTP Link header with rel="type" targeting a valid LDP container type."
     * https://solid.github.io/specification/protocol#writing-resources
     *
     * @param container - Parent container of the new URI.
     * @param isContainer - Does the new URI represent a container?
     * @param slug - Slug to use for the new URI.
     */
    protected createURI(container: ResourceIdentifier, isContainer: boolean, slug?: string): ResourceIdentifier;
    /**
     * Clean http Slug to be compatible with the server. Makes sure there are no unwanted characters
     * e.g.: cleanslug('&%26') returns '%26%26'
     * @param slug - the slug to clean
     */
    protected cleanSlug(slug: string): string;
    /**
     * Generate a valid URI to store a new Resource in the given container.
     * URI will be based on the slug header if there is one and is guaranteed to not exist yet.
     *
     * @param container - Identifier of the target container.
     * @param metadata - Metadata of the new resource.
     */
    protected createSafeUri(container: ResourceIdentifier, metadata: RepresentationMetadata): Promise<ResourceIdentifier>;
    /**
     * Checks if the given metadata represents a (potential) container,
     * both based on the metadata and the URI.
     * @param metadata - Metadata of the (new) resource.
     * @param suffix - Suffix of the URI. Can be the full URI, but only the last part is required.
     */
    protected isNewContainer(metadata: RepresentationMetadata, suffix?: string): boolean;
    /**
     * Checks in a list of types if any of them match a Container type.
     */
    protected hasContainerType(rdfTypes: Term[]): boolean;
    /**
     * Verifies if this is the metadata of a root storage container.
     */
    protected isRootStorage(metadata: RepresentationMetadata): boolean;
    /**
     * Checks if the given container has any non-auxiliary resources.
     */
    protected hasProperChildren(container: ResourceIdentifier): Promise<boolean>;
    /**
     * Deletes the given array of auxiliary identifiers.
     * Does not throw an error if something goes wrong.
     */
    protected safelyDeleteAuxiliaryResources(identifiers: ResourceIdentifier[]): Promise<ResourceIdentifier[]>;
    /**
     * Create containers starting from the root until the given identifier corresponds to an existing container.
     * Will throw errors if the identifier of the last existing "container" corresponds to an existing document.
     * @param container - Identifier of the container which will need to exist.
     */
    protected createRecursiveContainers(container: ResourceIdentifier): Promise<ModifiedResource[]>;
}
