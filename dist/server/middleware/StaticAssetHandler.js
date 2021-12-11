"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticAssetHandler = void 0;
const fs_1 = require("fs");
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
const mime = __importStar(require("mime-types"));
const LogUtil_1 = require("../../logging/LogUtil");
const ContentTypes_1 = require("../../util/ContentTypes");
const NotFoundHttpError_1 = require("../../util/errors/NotFoundHttpError");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const PathUtil_1 = require("../../util/PathUtil");
const StreamUtil_1 = require("../../util/StreamUtil");
const HttpHandler_1 = require("../HttpHandler");
/**
 * Handler that serves static resources on specific paths.
 * Relative file paths are assumed to be relative to cwd.
 * Relative file paths can be preceded by `@css:`, e.g. `@css:foo/bar`,
 * in case they need to be relative to the module root.
 */
class StaticAssetHandler extends HttpHandler_1.HttpHandler {
    /**
     * Creates a handler for the provided static resources.
     * @param assets - A mapping from URL paths to paths,
     *  where URL paths ending in a slash are interpreted as entire folders.
     * @param options - Cache expiration time in seconds.
     */
    constructor(assets, options = {}) {
        super();
        this.logger = LogUtil_1.getLoggerFor(this);
        this.mappings = {};
        for (const [url, path] of Object.entries(assets)) {
            this.mappings[url] = PathUtil_1.resolveAssetPath(path);
        }
        this.pathMatcher = this.createPathMatcher(assets);
        this.expires = Number.isInteger(options.expires) ? Math.max(0, options.expires) : 0;
    }
    /**
     * Creates a regular expression that matches the URL paths.
     */
    createPathMatcher(assets) {
        // Sort longest paths first to ensure the longest match has priority
        const paths = Object.keys(assets)
            .sort((pathA, pathB) => pathB.length - pathA.length);
        // Collect regular expressions for files and folders separately
        const files = ['.^'];
        const folders = ['.^'];
        for (const path of paths) {
            (path.endsWith('/') ? folders : files).push(escape_string_regexp_1.default(path));
        }
        // Either match an exact document or a file within a folder (stripping the query string)
        return new RegExp(`^(?:(${files.join('|')})|(${folders.join('|')})([^?]+))(?:\\?.*)?$`, 'u');
    }
    /**
     * Obtains the file path corresponding to the asset URL
     */
    getFilePath({ url }) {
        // Verify if the URL matches any of the paths
        const match = this.pathMatcher.exec(url !== null && url !== void 0 ? url : '');
        if (!match || match[0].includes('/..')) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`No static resource configured at ${url}`);
        }
        // The mapping is either a known document, or a file within a folder
        const [, document, folder, file] = match;
        return document ?
            this.mappings[document] :
            PathUtil_1.joinFilePath(this.mappings[folder], decodeURIComponent(file));
    }
    async canHandle({ request }) {
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Only GET and HEAD requests are supported');
        }
        this.getFilePath(request);
    }
    async handle({ request, response }) {
        // Determine the asset to serve
        const filePath = this.getFilePath(request);
        this.logger.debug(`Serving ${request.url} via static asset ${filePath}`);
        // Resolve when asset loading succeeds
        const asset = fs_1.createReadStream(filePath);
        return new Promise((resolve, reject) => {
            // Write a 200 response when the asset becomes readable
            asset.once('readable', () => {
                const contentType = mime.lookup(filePath) || ContentTypes_1.APPLICATION_OCTET_STREAM;
                response.writeHead(200, {
                    'content-type': contentType,
                    ...this.getCacheHeaders(),
                });
                // With HEAD, only write the headers
                if (request.method === 'HEAD') {
                    response.end();
                    asset.destroy();
                    // With GET, pipe the entire response
                }
                else {
                    StreamUtil_1.pipeSafely(asset, response);
                }
                resolve();
            });
            // Pass the error when something goes wrong
            asset.once('error', (error) => {
                const { code } = error;
                // When the file if not found or a folder, signal a 404
                if (code === 'ENOENT' || code === 'EISDIR') {
                    this.logger.debug(`Static asset ${filePath} not found`);
                    reject(new NotFoundHttpError_1.NotFoundHttpError(`Cannot find ${request.url}`));
                    // In other cases, we might already have started writing, so just hang up
                }
                else {
                    this.logger.warn(`Error reading asset ${filePath}: ${error.message}`, { error });
                    response.end();
                    asset.destroy();
                    resolve();
                }
            });
        });
    }
    getCacheHeaders() {
        return this.expires <= 0 ?
            {} :
            {
                'cache-control': `max-age=${this.expires}`,
                expires: new Date(Date.now() + (this.expires * 1000)).toUTCString(),
            };
    }
}
exports.StaticAssetHandler = StaticAssetHandler;
//# sourceMappingURL=StaticAssetHandler.js.map