import type { HttpHandlerInput } from '../HttpHandler';
import { HttpHandler } from '../HttpHandler';
/**
 * Handler that serves static resources on specific paths.
 * Relative file paths are assumed to be relative to cwd.
 * Relative file paths can be preceded by `@css:`, e.g. `@css:foo/bar`,
 * in case they need to be relative to the module root.
 */
export declare class StaticAssetHandler extends HttpHandler {
    private readonly mappings;
    private readonly pathMatcher;
    private readonly expires;
    private readonly logger;
    /**
     * Creates a handler for the provided static resources.
     * @param assets - A mapping from URL paths to paths,
     *  where URL paths ending in a slash are interpreted as entire folders.
     * @param options - Cache expiration time in seconds.
     */
    constructor(assets: Record<string, string>, options?: {
        expires?: number;
    });
    /**
     * Creates a regular expression that matches the URL paths.
     */
    private createPathMatcher;
    /**
     * Obtains the file path corresponding to the asset URL
     */
    private getFilePath;
    canHandle({ request }: HttpHandlerInput): Promise<void>;
    handle({ request, response }: HttpHandlerInput): Promise<void>;
    private getCacheHeaders;
}
