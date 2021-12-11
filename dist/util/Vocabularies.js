"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREFERRED_PREFIX_TERM = exports.PREFERRED_PREFIX = exports.CONTENT_TYPE_TERM = exports.CONTENT_TYPE = exports.XSD = exports.VCARD = exports.VANN = exports.SOLID_META = exports.SOLID_HTTP = exports.SOLID_ERROR = exports.SOLID = exports.RDF = exports.POSIX = exports.PIM = exports.OIDC = exports.MA = exports.LDP = exports.HTTP = exports.FOAF = exports.DC = exports.AUTH = exports.ACL = exports.createUriAndTermNamespace = exports.createTermNamespace = exports.createUriNamespace = exports.createNamespace = void 0;
/* eslint-disable function-paren-newline */
const data_model_1 = require("@rdfjs/data-model");
/**
 * Creates a function that expands local names from the given base URI,
 * and exports the given local names as properties on the returned object.
 */
function createNamespace(baseUri, toValue, ...localNames) {
    const expanded = {};
    // Expose the main namespace
    expanded.namespace = toValue(baseUri);
    // Expose the listed local names as properties
    for (const localName of localNames) {
        expanded[localName] = toValue(`${baseUri}${localName}`);
    }
    return expanded;
}
exports.createNamespace = createNamespace;
/**
 * Creates a function that expands local names from the given base URI into strings,
 * and exports the given local names as properties on the returned object.
 */
function createUriNamespace(baseUri, ...localNames) {
    return createNamespace(baseUri, (expanded) => expanded, ...localNames);
}
exports.createUriNamespace = createUriNamespace;
/**
 * Creates a function that expands local names from the given base URI into named nodes,
 * and exports the given local names as properties on the returned object.
 */
function createTermNamespace(baseUri, ...localNames) {
    return createNamespace(baseUri, data_model_1.namedNode, ...localNames);
}
exports.createTermNamespace = createTermNamespace;
/**
 * Creates a function that expands local names from the given base URI into string,
 * and exports the given local names as properties on the returned object.
 * Under the `terms` property, it exposes the expanded local names as named nodes.
 */
function createUriAndTermNamespace(baseUri, ...localNames) {
    return Object.assign(createUriNamespace(baseUri, ...localNames), { terms: createTermNamespace(baseUri, ...localNames) });
}
exports.createUriAndTermNamespace = createUriAndTermNamespace;
exports.ACL = createUriAndTermNamespace('http://www.w3.org/ns/auth/acl#', 'accessTo', 'agent', 'agentClass', 'agentGroup', 'AuthenticatedAgent', 'Authorization', 'default', 'mode', 'Write', 'Read', 'Append', 'Control');
exports.AUTH = createUriAndTermNamespace('urn:solid:auth:', 'userMode', 'publicMode');
exports.DC = createUriAndTermNamespace('http://purl.org/dc/terms/', 'description', 'modified', 'title');
exports.FOAF = createUriAndTermNamespace('http://xmlns.com/foaf/0.1/', 'Agent');
exports.HTTP = createUriAndTermNamespace('http://www.w3.org/2011/http#', 'statusCodeNumber');
exports.LDP = createUriAndTermNamespace('http://www.w3.org/ns/ldp#', 'contains', 'BasicContainer', 'Container', 'Resource');
exports.MA = createUriAndTermNamespace('http://www.w3.org/ns/ma-ont#', 'format');
exports.OIDC = createUriAndTermNamespace('http://www.w3.org/ns/solid/oidc#', 'redirect_uris');
exports.PIM = createUriAndTermNamespace('http://www.w3.org/ns/pim/space#', 'Storage');
exports.POSIX = createUriAndTermNamespace('http://www.w3.org/ns/posix/stat#', 'mtime', 'size');
exports.RDF = createUriAndTermNamespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#', 'type');
exports.SOLID = createUriAndTermNamespace('http://www.w3.org/ns/solid/terms#', 'oidcIssuer', 'oidcIssuerRegistrationToken', 'oidcRegistration');
exports.SOLID_ERROR = createUriAndTermNamespace('urn:npm:solid:community-server:error:', 'stack');
exports.SOLID_HTTP = createUriAndTermNamespace('urn:npm:solid:community-server:http:', 'location', 'slug');
exports.SOLID_META = createUriAndTermNamespace('urn:npm:solid:community-server:meta:', 
// This identifier is used as graph for all metadata that is generated on the fly and should not be stored
'ResponseMetadata', 
// This is used to identify templates that can be used for the representation of a resource
'template');
exports.VANN = createUriAndTermNamespace('http://purl.org/vocab/vann/', 'preferredNamespacePrefix');
exports.VCARD = createUriAndTermNamespace('http://www.w3.org/2006/vcard/ns#', 'hasMember');
exports.XSD = createUriAndTermNamespace('http://www.w3.org/2001/XMLSchema#', 'dateTime', 'integer');
// Alias for commonly used types
exports.CONTENT_TYPE = exports.MA.format;
exports.CONTENT_TYPE_TERM = exports.MA.terms.format;
exports.PREFERRED_PREFIX = exports.VANN.preferredNamespacePrefix;
exports.PREFERRED_PREFIX_TERM = exports.VANN.terms.preferredNamespacePrefix;
//# sourceMappingURL=Vocabularies.js.map