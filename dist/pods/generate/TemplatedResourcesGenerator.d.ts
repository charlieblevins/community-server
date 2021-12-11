/// <reference types="node" />
import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { FileIdentifierMapperFactory } from '../../storage/mapping/FileIdentifierMapper';
import type { TemplateEngine } from '../../util/templates/TemplateEngine';
import type { Resource, ResourcesGenerator } from './ResourcesGenerator';
import Dict = NodeJS.Dict;
/**
 * Generates resources by making use of a template engine.
 * The template folder structure will be kept.
 * Folders will be interpreted as containers and files as documents.
 * A FileIdentifierMapper will be used to generate identifiers that correspond to the relative structure.
 *
 * A relative `templateFolder` is resolved relative to cwd,
 * unless it's preceded by `@css:`, e.g. `@css:foo/bar`.
 */
export declare class TemplatedResourcesGenerator implements ResourcesGenerator {
    private readonly templateFolder;
    private readonly factory;
    private readonly templateEngine;
    private readonly templateExtension;
    /**
     * A mapper is needed to convert the template file paths to identifiers relative to the given base identifier.
     *
     * @param templateFolder - Folder where the templates are located.
     * @param factory - Factory used to generate mapper relative to the base identifier.
     * @param templateEngine - Template engine for generating the resources.
     * @param templateExtension - The extension of files that need to be interpreted as templates.
     *                            Will be removed to generate the identifier.
     */
    constructor(templateFolder: string, factory: FileIdentifierMapperFactory, templateEngine: TemplateEngine, templateExtension?: string);
    generate(location: ResourceIdentifier, options: Dict<string>): AsyncIterable<Resource>;
    /**
     * Generates results for all entries in the given folder, including the folder itself.
     */
    private processFolder;
    /**
     * Creates a TemplateResourceLink for the given filePath.
     * The identifier will be based on the file path stripped from the template extension,
     * but the filePath parameter will still point to the original file.
     */
    private toTemplateLink;
    /**
     * Generates TemplateResourceLinks for each entry in the given folder
     * and combines the results so resources and their metadata are grouped together.
     */
    private groupLinks;
    /**
     * Generates a Resource object for the given ResourceLink.
     * In the case of documents the corresponding template will be used.
     * If a ResourceLink of metadata is provided the corresponding data will be added as metadata.
     */
    private generateResource;
    /**
     * Generates a RepresentationMetadata using the given template.
     */
    private generateMetadata;
    /**
     * Creates a read stream from the file and applies the template if necessary.
     */
    private processFile;
}
