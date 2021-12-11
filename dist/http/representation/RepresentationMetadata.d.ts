import type { BlankNode, DefaultGraph, Literal, NamedNode, Quad, Term } from 'rdf-js';
import type { ResourceIdentifier } from './ResourceIdentifier';
export declare type MetadataIdentifier = ResourceIdentifier | NamedNode | BlankNode;
export declare type MetadataValue = NamedNode | Literal | string | (NamedNode | Literal | string)[];
export declare type MetadataRecord = Record<string, MetadataValue>;
export declare type MetadataGraph = NamedNode | BlankNode | DefaultGraph | string;
/**
 * Determines whether the object is a `RepresentationMetadata`.
 */
export declare function isRepresentationMetadata(object: any): object is RepresentationMetadata;
/**
 * Stores the metadata triples and provides methods for easy access.
 * Most functions return the metadata object to allow for chaining.
 */
export declare class RepresentationMetadata {
    protected readonly logger: import("../..").Logger;
    private store;
    private id;
    /**
     * @param identifier - Identifier of the resource relevant to this metadata.
     *                     A blank node will be generated if none is provided.
     *                     Strings will be converted to named nodes. @ignored
     * @param overrides - Key/value map of extra values that need to be added to the metadata. @ignored
     *
     * `@ignored` tag is necessary for Components-Generator.js
     */
    constructor(identifier?: MetadataIdentifier, overrides?: MetadataRecord);
    /**
     * @param metadata - Starts as a copy of the input metadata.
     * @param overrides - Key/value map of extra values that need to be added to the metadata.
     *                    Will override values that were set by the input metadata.
     */
    constructor(metadata?: RepresentationMetadata, overrides?: MetadataRecord);
    /**
     * @param identifier - Identifier of the resource relevant to this metadata.
     * @param contentType - Override for the content type of the representation.
     */
    constructor(identifier?: MetadataIdentifier, contentType?: string);
    /**
     * @param metadata - Starts as a copy of the input metadata.
     * @param contentType - Override for the content type of the representation.
     */
    constructor(metadata?: RepresentationMetadata, contentType?: string);
    /**
     * @param contentType - The content type of the representation.
     */
    constructor(contentType?: string);
    /**
     * @param metadata - Metadata values (defaulting to content type if a string)
     */
    constructor(metadata?: RepresentationMetadata | MetadataRecord | string);
    private setOverrides;
    /**
     * @returns All matching metadata quads.
     */
    quads(subject?: NamedNode | BlankNode | string | null, predicate?: NamedNode | string | null, object?: NamedNode | BlankNode | Literal | string | null, graph?: MetadataGraph | null): Quad[];
    /**
     * Identifier of the resource this metadata is relevant to.
     * Will update all relevant triples if this value gets changed.
     */
    get identifier(): NamedNode | BlankNode;
    set identifier(id: NamedNode | BlankNode);
    /**
     * Helper function to import all entries from the given metadata.
     * If the new metadata has a different identifier the internal one will be updated.
     * @param metadata - Metadata to import.
     */
    setMetadata(metadata: RepresentationMetadata): this;
    /**
     * @param subject - Subject of quad to add.
     * @param predicate - Predicate of quad to add.
     * @param object - Object of quad to add.
     * @param graph - Optional graph of quad to add.
     */
    addQuad(subject: NamedNode | BlankNode | string, predicate: NamedNode | string, object: NamedNode | BlankNode | Literal | string, graph?: MetadataGraph): this;
    /**
     * @param quads - Quads to add to the metadata.
     */
    addQuads(quads: Quad[]): this;
    /**
     * @param subject - Subject of quad to remove.
     * @param predicate - Predicate of quad to remove.
     * @param object - Object of quad to remove.
     * @param graph - Optional graph of quad to remove.
     */
    removeQuad(subject: NamedNode | BlankNode | string, predicate: NamedNode | string, object: NamedNode | BlankNode | Literal | string, graph?: MetadataGraph): this;
    /**
     * @param quads - Quads to remove from the metadata.
     */
    removeQuads(quads: Quad[]): this;
    /**
     * Adds a value linked to the identifier. Strings get converted to literals.
     * @param predicate - Predicate linking identifier to value.
     * @param object - Value(s) to add.
     * @param graph - Optional graph of where to add the values to.
     */
    add(predicate: NamedNode | string, object: MetadataValue, graph?: MetadataGraph): this;
    /**
     * Removes the given value from the metadata. Strings get converted to literals.
     * @param predicate - Predicate linking identifier to value.
     * @param object - Value(s) to remove.
     * @param graph - Optional graph of where to remove the values from.
     */
    remove(predicate: NamedNode | string, object: MetadataValue, graph?: MetadataGraph): this;
    /**
     * Helper function to simplify add/remove
     * Runs the given function on all predicate/object pairs, but only converts the predicate to a named node once.
     */
    private forQuads;
    /**
     * Removes all values linked through the given predicate.
     * @param predicate - Predicate to remove.
     * @param graph - Optional graph where to remove from.
     */
    removeAll(predicate: NamedNode | string, graph?: MetadataGraph): this;
    /**
     * Finds all object values matching the given predicate and/or graph.
     * @param predicate - Optional predicate to get the values for.
     * @param graph - Optional graph where to get from.
     *
     * @returns An array with all matches.
     */
    getAll(predicate: NamedNode | string, graph?: MetadataGraph): Term[];
    /**
     * @param predicate - Predicate to get the value for.
     * @param graph - Optional graph where the triple should be found.
     *
     * @throws Error
     * If there are multiple matching values.
     *
     * @returns The corresponding value. Undefined if there is no match
     */
    get(predicate: NamedNode | string, graph?: MetadataGraph): Term | undefined;
    /**
     * Sets the value for the given predicate, removing all other instances.
     * In case the object is undefined this is identical to `removeAll(predicate)`.
     * @param predicate - Predicate linking to the value.
     * @param object - Value(s) to set.
     * @param graph - Optional graph where the triple should be stored.
     */
    set(predicate: NamedNode | string, object?: MetadataValue, graph?: MetadataGraph): this;
    /**
     * Shorthand for the CONTENT_TYPE predicate.
     */
    get contentType(): string | undefined;
    set contentType(input: string | undefined);
}
