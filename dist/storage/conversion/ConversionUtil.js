"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInternalContentType = exports.matchesMediaType = exports.matchesMediaPreferences = exports.getConversionTarget = exports.getBestPreference = exports.getWeightedPreferences = exports.getTypeWeight = exports.cleanPreferences = void 0;
const ContentTypes_1 = require("../../util/ContentTypes");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
/**
 * Cleans incoming preferences to prevent unwanted behaviour.
 * Makes sure internal types have weight 0, unless specifically requested in the preferences,
 * and interprets empty preferences as accepting everything.
 *
 * @param preferences - Preferences that need to be updated.
 *
 * @returns A copy of the the preferences with the necessary updates.
 */
function cleanPreferences(preferences = {}) {
    // No preference means anything is acceptable
    const preferred = { ...preferences };
    if (Object.keys(preferences).length === 0) {
        preferred['*/*'] = 1;
    }
    // Prevent accidental use of internal types
    if (!(ContentTypes_1.INTERNAL_ALL in preferred)) {
        preferred[ContentTypes_1.INTERNAL_ALL] = 0;
    }
    return preferred;
}
exports.cleanPreferences = cleanPreferences;
/**
 * Tries to match the given type to the given preferences.
 * In case there are multiple matches the most specific one will be chosen as per RFC 7231.
 *
 * @param type - Type for which the matching weight is needed.
 * @param preferred - Preferences to match the type to.
 *
 * @returns The corresponding weight from the preferences or 0 if there is no match.
 */
function getTypeWeight(type, preferred) {
    var _a, _b, _c, _d;
    const match = /^([^/]+)\/([^\s;]+)/u.exec(type);
    if (!match) {
        throw new InternalServerError_1.InternalServerError(`Unexpected media type: ${type}.`);
    }
    const [, main, sub] = match;
    // RFC 7231
    //    Media ranges can be overridden by more specific media ranges or
    //    specific media types.  If more than one media range applies to a
    //    given type, the most specific reference has precedence.
    return (_d = (_c = (_b = (_a = preferred[type]) !== null && _a !== void 0 ? _a : preferred[`${main}/${sub}`]) !== null && _b !== void 0 ? _b : preferred[`${main}/*`]) !== null && _c !== void 0 ? _c : preferred['*/*']) !== null && _d !== void 0 ? _d : 0;
}
exports.getTypeWeight = getTypeWeight;
/**
 * Measures the weights for all the given types when matched against the given preferences.
 * Results will be sorted by weight.
 * Weights of 0 indicate that no match is possible.
 *
 * @param types - Types for which we want to calculate the weights.
 * @param preferred - Preferences to match the types against.
 *
 * @returns An array with a {@link ValuePreference} object for every input type, sorted by calculated weight.
 */
function getWeightedPreferences(types, preferred) {
    const weightedSupported = Object.entries(types)
        .map(([value, quality]) => ({ value, weight: quality * getTypeWeight(value, preferred) }));
    return weightedSupported
        .sort(({ weight: weightA }, { weight: weightB }) => weightB - weightA);
}
exports.getWeightedPreferences = getWeightedPreferences;
/**
 * Finds the type from the given types that has the best match with the given preferences,
 * based on the calculated weight.
 *
 * @param types - Types for which we want to find the best match.
 * @param preferred - Preferences to match the types against.
 *
 * @returns A {@link ValuePreference} containing the best match and the corresponding weight.
 * Undefined if there is no match.
 */
function getBestPreference(types, preferred) {
    // Could also return the first entry of the above function but this is more efficient
    const result = Object.entries(types).reduce((best, [value, quality]) => {
        if (best.weight >= quality) {
            return best;
        }
        const weight = quality * getTypeWeight(value, preferred);
        if (weight > best.weight) {
            return { value, weight };
        }
        return best;
    }, { value: '', weight: 0 });
    if (result.weight > 0) {
        return result;
    }
}
exports.getBestPreference = getBestPreference;
/**
 * For a media type converter that can generate the given types,
 * this function tries to find the type that best matches the given preferences.
 *
 * This function combines several other conversion utility functions
 * to determine what output a converter should generate:
 * it cleans the preferences with {@link cleanPreferences} to support empty preferences
 * and to prevent the accidental generation of internal types,
 * after which the best match gets found based on the weights.
 *
 * @param types - Media types that can be converted to.
 * @param preferred - Preferences for output type.
 *
 * @returns The best match. Undefined if there is no match.
 */
function getConversionTarget(types, preferred = {}) {
    var _a;
    const cleaned = cleanPreferences(preferred);
    return (_a = getBestPreference(types, cleaned)) === null || _a === void 0 ? void 0 : _a.value;
}
exports.getConversionTarget = getConversionTarget;
/**
 * Checks if the given type matches the given preferences.
 *
 * @param type - Type to match.
 * @param preferred - Preferences to match against.
 */
function matchesMediaPreferences(type, preferred) {
    return getTypeWeight(type, cleanPreferences(preferred)) > 0;
}
exports.matchesMediaPreferences = matchesMediaPreferences;
/**
 * Checks if the given two media types/ranges match each other.
 * Takes wildcards into account.
 * @param mediaA - Media type to match.
 * @param mediaB - Media type to match.
 *
 * @returns True if the media type patterns can match each other.
 */
function matchesMediaType(mediaA, mediaB) {
    if (mediaA === mediaB) {
        return true;
    }
    const [typeA, subTypeA] = mediaA.split('/');
    const [typeB, subTypeB] = mediaB.split('/');
    if (typeA === '*' || typeB === '*') {
        return true;
    }
    if (typeA !== typeB) {
        return false;
    }
    if (subTypeA === '*' || subTypeB === '*') {
        return true;
    }
    return subTypeA === subTypeB;
}
exports.matchesMediaType = matchesMediaType;
/**
 * Checks if the given content type is an internal content type such as internal/quads.
 * Response will be `false` if the input type is undefined.
 *
 * Do not use this for media ranges.
 *
 * @param contentType - Type to check.
 */
function isInternalContentType(contentType) {
    return typeof contentType !== 'undefined' && matchesMediaType(contentType, ContentTypes_1.INTERNAL_ALL);
}
exports.isInternalContentType = isInternalContentType;
//# sourceMappingURL=ConversionUtil.js.map