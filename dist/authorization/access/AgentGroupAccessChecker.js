"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentGroupAccessChecker = void 0;
const FetchUtil_1 = require("../../util/FetchUtil");
const PromiseUtil_1 = require("../../util/PromiseUtil");
const StreamUtil_1 = require("../../util/StreamUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
const AccessChecker_1 = require("./AccessChecker");
/**
 * Checks if the given WebID belongs to a group that has access.
 * Implements the behaviour of groups from the WAC specification.
 *
 * Fetched results will be stored in an ExpiringStorage.
 *
 * Requires a storage that can store JS objects.
 * `expiration` parameter is how long entries in the cache should be stored in seconds, defaults to 3600.
 */
class AgentGroupAccessChecker extends AccessChecker_1.AccessChecker {
    constructor(converter, cache, expiration = 3600) {
        super();
        this.converter = converter;
        this.cache = cache;
        this.expiration = expiration * 1000;
    }
    async handle({ acl, rule, credential }) {
        if (typeof credential.webId === 'string') {
            const { webId } = credential;
            const groups = acl.getObjects(rule, Vocabularies_1.ACL.terms.agentGroup, null);
            return await PromiseUtil_1.promiseSome(groups.map(async (group) => this.isMemberOfGroup(webId, group)));
        }
        return false;
    }
    /**
     * Checks if the given agent is member of a given vCard group.
     * @param webId - WebID of the agent that needs access.
     * @param group - URL of the vCard group that needs to be checked.
     *
     * @returns If the agent is member of the given vCard group.
     */
    async isMemberOfGroup(webId, group) {
        const groupDocument = { path: /^[^#]*/u.exec(group.value)[0] };
        // Fetch the required vCard group file
        const quads = await this.fetchCachedQuads(groupDocument.path);
        return quads.countQuads(group, Vocabularies_1.VCARD.terms.hasMember, webId, null) !== 0;
    }
    /**
     * Fetches quads from the given URL.
     * Will cache the values for later re-use.
     */
    async fetchCachedQuads(url) {
        let result = await this.cache.get(url);
        if (!result) {
            const prom = (async () => {
                const representation = await FetchUtil_1.fetchDataset(url, this.converter);
                return StreamUtil_1.readableToQuads(representation.data);
            })();
            await this.cache.set(url, prom, this.expiration);
            result = await prom;
        }
        return result;
    }
}
exports.AgentGroupAccessChecker = AgentGroupAccessChecker;
//# sourceMappingURL=AgentGroupAccessChecker.js.map