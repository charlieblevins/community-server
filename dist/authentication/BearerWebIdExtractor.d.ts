import type { HttpRequest } from '../server/HttpRequest';
import type { CredentialSet } from './Credentials';
import { CredentialsExtractor } from './CredentialsExtractor';
export declare class BearerWebIdExtractor extends CredentialsExtractor {
    protected readonly logger: import("..").Logger;
    private readonly verify;
    constructor();
    canHandle({ headers }: HttpRequest): Promise<void>;
    handle(request: HttpRequest): Promise<CredentialSet>;
}
