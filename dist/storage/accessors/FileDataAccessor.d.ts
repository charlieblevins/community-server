/// <reference types="node" />
import type { Readable } from 'stream';
import type { Representation } from '../../http/representation/Representation';
import { RepresentationMetadata } from '../../http/representation/RepresentationMetadata';
import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { Guarded } from '../../util/GuardedStream';
import type { FileIdentifierMapper } from '../mapping/FileIdentifierMapper';
import type { DataAccessor } from './DataAccessor';
/**
 * DataAccessor that uses the file system to store documents as files and containers as folders.
 */
export declare class FileDataAccessor implements DataAccessor {
    private readonly resourceMapper;
    constructor(resourceMapper: FileIdentifierMapper);
    /**
     * Only binary data can be directly stored as files so will error on non-binary data.
     */
    canHandle(representation: Representation): Promise<void>;
    /**
     * Will return data stream directly to the file corresponding to the resource.
     * Will throw NotFoundHttpError if the input is a container.
     */
    getData(identifier: ResourceIdentifier): Promise<Guarded<Readable>>;
    /**
     * Will return corresponding metadata by reading the metadata file (if it exists)
     * and adding file system specific metadata elements.
     */
    getMetadata(identifier: ResourceIdentifier): Promise<RepresentationMetadata>;
    getChildren(identifier: ResourceIdentifier): AsyncIterableIterator<RepresentationMetadata>;
    /**
     * Writes the given data as a file (and potential metadata as additional file).
     * The metadata file will be written first and will be deleted if something goes wrong writing the actual data.
     */
    writeDocument(identifier: ResourceIdentifier, data: Guarded<Readable>, metadata: RepresentationMetadata): Promise<void>;
    /**
     * Creates corresponding folder if necessary and writes metadata to metadata file if necessary.
     */
    writeContainer(identifier: ResourceIdentifier, metadata: RepresentationMetadata): Promise<void>;
    /**
     * Removes the corresponding file/folder (and metadata file).
     */
    deleteResource(identifier: ResourceIdentifier): Promise<void>;
    /**
     * Gets the Stats object corresponding to the given file path,
     * resolving symbolic links.
     * @param path - File path to get info from.
     *
     * @throws NotFoundHttpError
     * If the file/folder doesn't exist.
     */
    private getStats;
    /**
     * Reads and generates all metadata relevant for the given file,
     * ingesting it into a RepresentationMetadata object.
     *
     * @param link - Path related metadata.
     * @param stats - Stats object of the corresponding file.
     */
    private getFileMetadata;
    /**
     * Reads and generates all metadata relevant for the given directory,
     * ingesting it into a RepresentationMetadata object.
     *
     * @param link - Path related metadata.
     * @param stats - Stats object of the corresponding directory.
     */
    private getDirectoryMetadata;
    /**
     * Writes the metadata of the resource to a meta file.
     * @param link - Path related metadata of the resource.
     * @param metadata - Metadata to write.
     *
     * @returns True if data was written to a file.
     */
    private writeMetadata;
    /**
     * Generates metadata relevant for any resources stored by this accessor.
     * @param link - Path related metadata.
     * @param stats - Stats objects of the corresponding directory.
     * @param isContainer - If the path points to a container (directory) or not.
     */
    private getBaseMetadata;
    /**
     * Reads the metadata from the corresponding metadata file.
     * Returns an empty array if there is no metadata file.
     *
     * @param identifier - Identifier of the resource (not the metadata!).
     */
    private getRawMetadata;
    /**
     * Generate metadata for all children in a container.
     *
     * @param link - Path related metadata.
     */
    private getChildMetadata;
    /**
     * Helper function to add file system related metadata.
     * @param metadata - metadata object to add to
     * @param stats - Stats of the file/directory corresponding to the resource.
     */
    private addPosixMetadata;
    /**
     * Verifies if there already is a file corresponding to the given resource.
     * If yes, that file is removed if it does not match the path given in the input ResourceLink.
     * This can happen if the content-type differs from the one that was stored.
     *
     * @param link - ResourceLink corresponding to the new resource data.
     */
    private verifyExistingExtension;
    /**
     * Helper function without extra validation checking to create a data file.
     * @param path - The filepath of the file to be created.
     * @param data - The data to be put in the file.
     */
    private writeDataFile;
}
