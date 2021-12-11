import type { Store } from 'n3';
import type { RepresentationConverter } from '../../storage/conversion/RepresentationConverter';
import type { ExpiringStorage } from '../../storage/keyvalue/ExpiringStorage';
import type { AccessCheckerArgs } from './AccessChecker';
import { AccessChecker } from './AccessChecker';
/**
 * Checks if the given WebID belongs to a group that has access.
 * Implements the behaviour of groups from the WAC specification.
 *
 * Fetched results will be stored in an ExpiringStorage.
 *
 * Requires a storage that can store JS objects.
 * `expiration` parameter is how long entries in the cache should be stored in seconds, defaults to 3600.
 */
export declare class AgentGroupAccessChecker extends AccessChecker {
    private readonly converter;
    private readonly cache;
    private readonly expiration;
    constructor(converter: RepresentationConverter, cache: ExpiringStorage<string, Promise<Store>>, expiration?: number);
    handle({ acl, rule, credential }: AccessCheckerArgs): Promise<boolean>;
    /**
     * Checks if the given agent is member of a given vCard group.
     * @param webId - WebID of the agent that needs access.
     * @param group - URL of the vCard group that needs to be checked.
     *
     * @returns If the agent is member of the given vCard group.
     */
    private isMemberOfGroup;
    /**
     * Fetches quads from the given URL.
     * Will cache the values for later re-use.
     */
    private fetchCachedQuads;
}
