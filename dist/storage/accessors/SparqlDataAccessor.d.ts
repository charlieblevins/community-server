/// <reference types="node" />
import type { Readable } from 'stream';
import type { Representation } from '../../http/representation/Representation';
import { RepresentationMetadata } from '../../http/representation/RepresentationMetadata';
import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { Guarded } from '../../util/GuardedStream';
import type { IdentifierStrategy } from '../../util/identifiers/IdentifierStrategy';
import type { DataAccessor } from './DataAccessor';
/**
 * Stores all data and metadata of resources in a SPARQL backend.
 * Communication is done by sending SPARQL queries.
 * Queries are constructed in such a way to keep everything consistent,
 * such as updating containment triples and deleting old data when it is overwritten.
 *
 * Since metadata is hidden, no containment triples are stored for metadata files.
 *
 * All input container metadata is stored in its metadata identifier.
 * The containment triples are stored in the graph corresponding to the actual identifier
 * so those don't get overwritten.
 */
export declare class SparqlDataAccessor implements DataAccessor {
    protected readonly logger: import("../..").Logger;
    private readonly endpoint;
    private readonly identifierStrategy;
    private readonly fetcher;
    private readonly generator;
    constructor(endpoint: string, identifierStrategy: IdentifierStrategy);
    /**
     * Only Quad data streams are supported.
     */
    canHandle(representation: Representation): Promise<void>;
    /**
     * Returns all triples stored for the corresponding identifier.
     * Note that this will not throw a 404 if no results were found.
     */
    getData(identifier: ResourceIdentifier): Promise<Guarded<Readable>>;
    /**
     * Returns the metadata for the corresponding identifier.
     * Will throw 404 if no metadata was found.
     */
    getMetadata(identifier: ResourceIdentifier): Promise<RepresentationMetadata>;
    getChildren(identifier: ResourceIdentifier): AsyncIterableIterator<RepresentationMetadata>;
    /**
     * Writes the given metadata for the container.
     */
    writeContainer(identifier: ResourceIdentifier, metadata: RepresentationMetadata): Promise<void>;
    /**
     * Reads the given data stream and stores it together with the metadata.
     */
    writeDocument(identifier: ResourceIdentifier, data: Guarded<Readable>, metadata: RepresentationMetadata): Promise<void>;
    /**
     * Removes all graph data relevant to the given identifier.
     */
    deleteResource(identifier: ResourceIdentifier): Promise<void>;
    /**
     * Helper function to get named nodes corresponding to the identifier and its parent container.
     * In case of a root container only the name will be returned.
     */
    private getRelatedNames;
    /**
     * Creates the name for the metadata of a resource.
     * @param name - Name of the (non-metadata) resource.
     */
    private getMetadataNode;
    /**
     * Checks if the given identifier corresponds to the names used for metadata identifiers.
     */
    private isMetadataIdentifier;
    /**
     * Creates a CONSTRUCT query that returns all quads contained within a single resource.
     * @param name - Name of the resource to query.
     */
    private sparqlConstruct;
    private sparqlSelectGraph;
    /**
     * Creates an update query that overwrites the data and metadata of a resource.
     * If there are no triples we assume it's a container (so don't overwrite the main graph with containment triples).
     * @param name - Name of the resource to update.
     * @param metadata - New metadata of the resource.
     * @param parent - Name of the parent to update the containment triples.
     * @param triples - New data of the resource.
     */
    private sparqlInsert;
    /**
     * Creates a query that deletes everything related to the given name.
     * @param name - Name of resource to delete.
     * @param parent - Parent of the resource to delete so the containment triple can be removed (unless root).
     */
    private sparqlDelete;
    /**
     * Helper function for creating SPARQL update queries.
     * Creates an operation for deleting all triples in a graph.
     * @param name - Name of the graph to delete.
     */
    private sparqlUpdateDeleteAll;
    /**
     * Helper function for creating SPARQL update queries.
     * Creates a Graph selector with the given triples.
     * @param name - Name of the graph.
     * @param triples - Triples/triple patterns to select.
     */
    private sparqlUpdateGraph;
    /**
     * Sends a SPARQL CONSTRUCT query to the endpoint and returns a stream of quads.
     * @param sparqlQuery - Query to execute.
     */
    private sendSparqlConstruct;
    /**
     * Sends a SPARQL update query to the stored endpoint.
     * @param sparqlQuery - Query to send.
     */
    private sendSparqlUpdate;
}
