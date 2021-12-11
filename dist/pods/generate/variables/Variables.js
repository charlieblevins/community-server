"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidVariable = exports.TEMPLATE_VARIABLE = exports.TEMPLATE = void 0;
const Vocabularies_1 = require("../../../util/Vocabularies");
exports.TEMPLATE = Vocabularies_1.createUriAndTermNamespace('urn:solid-server:template:', 'ResourceStore');
// Variables used for configuration templates
// This is not an exclusive list
exports.TEMPLATE_VARIABLE = Vocabularies_1.createUriAndTermNamespace(`${exports.TEMPLATE.namespace}variable:`, 'baseUrl', 'rootFilePath', 'sparqlEndpoint', 'templateConfig');
/**
 * Checks if the given variable is one that is supported.
 * This can be used to weed out irrelevant parameters in an object.
 */
function isValidVariable(variable) {
    return variable.startsWith(exports.TEMPLATE_VARIABLE.namespace);
}
exports.isValidVariable = isValidVariable;
//# sourceMappingURL=Variables.js.map