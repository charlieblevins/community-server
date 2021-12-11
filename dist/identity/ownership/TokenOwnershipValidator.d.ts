import type { RepresentationConverter } from '../../storage/conversion/RepresentationConverter';
import type { ExpiringStorage } from '../../storage/keyvalue/ExpiringStorage';
import { OwnershipValidator } from './OwnershipValidator';
/**
 * Validates ownership of a WebId by seeing if a specific triple can be added.
 * `expiration` parameter is how long the token should be valid in minutes.
 */
export declare class TokenOwnershipValidator extends OwnershipValidator {
    protected readonly logger: import("../..").Logger;
    private readonly converter;
    private readonly storage;
    private readonly expiration;
    constructor(converter: RepresentationConverter, storage: ExpiringStorage<string, string>, expiration?: number);
    handle({ webId }: {
        webId: string;
    }): Promise<void>;
    /**
     * Creates a key to use with the token storage.
     */
    private getTokenKey;
    /**
     * Generates a random verification token;
     */
    private generateToken;
    /**
     * Fetches data from the WebID to determine if the token is present.
     */
    private hasToken;
    /**
     * Throws an error containing the description of which triple is needed for verification.
     */
    private throwError;
}
