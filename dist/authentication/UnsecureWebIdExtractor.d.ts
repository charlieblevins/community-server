import type { HttpRequest } from '../server/HttpRequest';
import type { CredentialSet } from './Credentials';
import { CredentialsExtractor } from './CredentialsExtractor';
/**
 * Credentials extractor which simply interprets the contents of the Authorization header as a WebID.
 */
export declare class UnsecureWebIdExtractor extends CredentialsExtractor {
    protected readonly logger: import("..").Logger;
    canHandle({ headers }: HttpRequest): Promise<void>;
    handle({ headers }: HttpRequest): Promise<CredentialSet>;
}
