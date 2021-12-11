import type { TargetExtractor } from '../http/input/identifier/TargetExtractor';
import type { HttpRequest } from '../server/HttpRequest';
import type { CredentialSet } from './Credentials';
import { CredentialsExtractor } from './CredentialsExtractor';
/**
 * Credentials extractor that extracts a WebID from a DPoP-bound access token.
 */
export declare class DPoPWebIdExtractor extends CredentialsExtractor {
    private readonly originalUrlExtractor;
    private readonly verify;
    protected readonly logger: import("..").Logger;
    /**
     * @param originalUrlExtractor - Reconstructs the original URL as requested by the client
     */
    constructor(originalUrlExtractor: TargetExtractor);
    canHandle({ headers }: HttpRequest): Promise<void>;
    handle(request: HttpRequest): Promise<CredentialSet>;
}
