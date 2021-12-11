import type { ValuePreference, ValuePreferences } from '../../http/representation/RepresentationPreferences';
/**
 * Cleans incoming preferences to prevent unwanted behaviour.
 * Makes sure internal types have weight 0, unless specifically requested in the preferences,
 * and interprets empty preferences as accepting everything.
 *
 * @param preferences - Preferences that need to be updated.
 *
 * @returns A copy of the the preferences with the necessary updates.
 */
export declare function cleanPreferences(preferences?: ValuePreferences): ValuePreferences;
/**
 * Tries to match the given type to the given preferences.
 * In case there are multiple matches the most specific one will be chosen as per RFC 7231.
 *
 * @param type - Type for which the matching weight is needed.
 * @param preferred - Preferences to match the type to.
 *
 * @returns The corresponding weight from the preferences or 0 if there is no match.
 */
export declare function getTypeWeight(type: string, preferred: ValuePreferences): number;
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
export declare function getWeightedPreferences(types: ValuePreferences, preferred: ValuePreferences): ValuePreference[];
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
export declare function getBestPreference(types: ValuePreferences, preferred: ValuePreferences): ValuePreference | undefined;
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
export declare function getConversionTarget(types: ValuePreferences, preferred?: ValuePreferences): string | undefined;
/**
 * Checks if the given type matches the given preferences.
 *
 * @param type - Type to match.
 * @param preferred - Preferences to match against.
 */
export declare function matchesMediaPreferences(type: string, preferred?: ValuePreferences): boolean;
/**
 * Checks if the given two media types/ranges match each other.
 * Takes wildcards into account.
 * @param mediaA - Media type to match.
 * @param mediaB - Media type to match.
 *
 * @returns True if the media type patterns can match each other.
 */
export declare function matchesMediaType(mediaA: string, mediaB: string): boolean;
/**
 * Checks if the given content type is an internal content type such as internal/quads.
 * Response will be `false` if the input type is undefined.
 *
 * Do not use this for media ranges.
 *
 * @param contentType - Type to check.
 */
export declare function isInternalContentType(contentType?: string): boolean;
