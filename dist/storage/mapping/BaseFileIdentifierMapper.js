"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFileIdentifierMapper = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const ContentTypes_1 = require("../../util/ContentTypes");
const BadRequestHttpError_1 = require("../../util/errors/BadRequestHttpError");
const ConflictHttpError_1 = require("../../util/errors/ConflictHttpError");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
const NotFoundHttpError_1 = require("../../util/errors/NotFoundHttpError");
const PathUtil_1 = require("../../util/PathUtil");
/**
 * Base class for {@link FileIdentifierMapper} implementations.
 */
class BaseFileIdentifierMapper {
    constructor(base, rootFilepath) {
        this.logger = LogUtil_1.getLoggerFor(this);
        this.baseRequestURI = PathUtil_1.trimTrailingSlashes(base);
        this.rootFilepath = PathUtil_1.trimTrailingSlashes(PathUtil_1.normalizeFilePath(rootFilepath));
    }
    /**
     * Maps the given resource identifier / URL to a file path.
     * Determines the content type if none was provided.
     * For containers the content-type input is ignored.
     * @param identifier - The input identifier.
     * @param isMetadata - If we need the data or metadata file path.
     * @param contentType - The content-type provided with the request.
     *
     * @returns A ResourceLink with all the necessary metadata.
     */
    async mapUrlToFilePath(identifier, isMetadata, contentType) {
        // Technically we could allow paths ending on .meta as long as we make sure there is never a mixup.
        // But this can lead to potential issues.
        // This also immediately stops users that expect they can update metadata like this.
        if (this.isMetadataPath(identifier.path)) {
            throw new ConflictHttpError_1.ConflictHttpError('Not allowed to create files with the metadata extension.');
        }
        let path = this.getRelativePath(identifier);
        if (isMetadata) {
            path += '.meta';
        }
        this.validateRelativePath(path, identifier);
        const filePath = this.getAbsolutePath(path);
        return PathUtil_1.isContainerIdentifier(identifier) ?
            this.mapUrlToContainerPath(identifier, filePath) :
            this.mapUrlToDocumentPath(identifier, filePath, contentType);
    }
    /**
     * Maps the given container identifier to a file path,
     * possibly making alterations to the direct translation.
     * @param identifier - The input identifier.
     * @param filePath - The direct translation of the identifier onto the file path.
     *
     * @returns A ResourceLink with all the necessary metadata.
     */
    async mapUrlToContainerPath(identifier, filePath) {
        this.logger.debug(`URL ${identifier.path} points to the container ${filePath}`);
        return { identifier, filePath, isMetadata: this.isMetadataPath(filePath) };
    }
    /**
     * Maps the given document identifier to a file path,
     * possibly making alterations to the direct translation
     * (for instance, based on its content type)).
     * Determines the content type if none was provided.
     * @param identifier - The input identifier.
     * @param filePath - The direct translation of the identifier onto the file path.
     * @param contentType - The content-type provided with the request.
     *
     * @returns A ResourceLink with all the necessary metadata.
     */
    async mapUrlToDocumentPath(identifier, filePath, contentType) {
        contentType = await this.getContentTypeFromUrl(identifier, contentType);
        this.logger.debug(`The path for ${identifier.path} is ${filePath}`);
        return { identifier, filePath, contentType, isMetadata: this.isMetadataPath(filePath) };
    }
    /**
     * Determines the content type from the document identifier.
     * @param identifier - The input identifier.
     * @param contentType - The content-type provided with the request.
     *
     * @returns The content type of the document.
     */
    async getContentTypeFromUrl(identifier, contentType) {
        return contentType !== null && contentType !== void 0 ? contentType : ContentTypes_1.APPLICATION_OCTET_STREAM;
    }
    /**
     * Maps the given file path to a URL and determines its content type.
     * @param filePath - The input file path.
     * @param isContainer - If the path corresponds to a file.
     *
     * @returns A ResourceLink with all the necessary metadata.
     */
    async mapFilePathToUrl(filePath, isContainer) {
        if (!filePath.startsWith(this.rootFilepath)) {
            this.logger.error(`Trying to access file ${filePath} outside of ${this.rootFilepath}`);
            throw new InternalServerError_1.InternalServerError(`File ${filePath} is not part of the file storage at ${this.rootFilepath}`);
        }
        const relative = filePath.slice(this.rootFilepath.length);
        let url;
        let contentType;
        if (isContainer) {
            url = await this.getContainerUrl(relative);
            this.logger.debug(`Container filepath ${filePath} maps to URL ${url}`);
        }
        else {
            url = await this.getDocumentUrl(relative);
            this.logger.debug(`Document ${filePath} maps to URL ${url}`);
            contentType = await this.getContentTypeFromPath(filePath);
        }
        const isMetadata = this.isMetadataPath(filePath);
        if (isMetadata) {
            url = url.slice(0, -'.meta'.length);
        }
        return { identifier: { path: url }, filePath, contentType, isMetadata };
    }
    /**
     * Maps the given container path to a URL and determines its content type.
     * @param relative - The relative container path.
     *
     * @returns A ResourceLink with all the necessary metadata.
     */
    async getContainerUrl(relative) {
        return PathUtil_1.ensureTrailingSlash(this.baseRequestURI + PathUtil_1.encodeUriPathComponents(relative));
    }
    /**
     * Maps the given document path to a URL and determines its content type.
     * @param relative - The relative document path.
     *
     * @returns A ResourceLink with all the necessary metadata.
     */
    async getDocumentUrl(relative) {
        return PathUtil_1.trimTrailingSlashes(this.baseRequestURI + PathUtil_1.encodeUriPathComponents(relative));
    }
    /**
     * Determines the content type from the relative path.
     * @param filePath - The file path of the document.
     *
     * @returns The content type of the document.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getContentTypeFromPath(filePath) {
        return ContentTypes_1.APPLICATION_OCTET_STREAM;
    }
    /**
     * Get the absolute file path based on the rootFilepath.
     * @param path - The relative file path.
     *
     * @returns Absolute path of the file.
     */
    getAbsolutePath(path) {
        return PathUtil_1.joinFilePath(this.rootFilepath, path);
    }
    /**
     * Strips the baseRequestURI from the identifier.
     * @param identifier - Incoming identifier.
     *
     * @throws {@link NotFoundHttpError}
     * If the identifier does not match the baseRequestURI.
     *
     * @returns A string representing the relative path.
     */
    getRelativePath(identifier) {
        if (!identifier.path.startsWith(this.baseRequestURI)) {
            this.logger.warn(`The URL ${identifier.path} is outside of the scope ${this.baseRequestURI}`);
            throw new NotFoundHttpError_1.NotFoundHttpError();
        }
        return PathUtil_1.decodeUriPathComponents(identifier.path.slice(this.baseRequestURI.length));
    }
    /**
     * Check if the given relative path is valid.
     *
     * @throws {@link BadRequestHttpError}
     * If the relative path is invalid.
     *
     * @param path - A relative path, as generated by {@link getRelativePath}.
     * @param identifier - A resource identifier.
     */
    validateRelativePath(path, identifier) {
        if (!path.startsWith('/')) {
            this.logger.warn(`URL ${identifier.path} needs a / after the base`);
            throw new BadRequestHttpError_1.BadRequestHttpError('URL needs a / after the base');
        }
        if (path.includes('/..')) {
            this.logger.warn(`Disallowed /.. segment in URL ${identifier.path}.`);
            throw new BadRequestHttpError_1.BadRequestHttpError('Disallowed /.. segment in URL');
        }
    }
    /**
     * Checks if the given path is a metadata path.
     */
    isMetadataPath(path) {
        return path.endsWith('.meta');
    }
}
exports.BaseFileIdentifierMapper = BaseFileIdentifierMapper;
//# sourceMappingURL=BaseFileIdentifierMapper.js.map