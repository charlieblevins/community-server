import type { Representation } from '../../http/representation/Representation';
import type { RepresentationConverterArgs } from './RepresentationConverter';
import { RepresentationConverter } from './RepresentationConverter';
import type { TypedRepresentationConverter } from './TypedRepresentationConverter';
/**
 * A meta converter that takes an array of other converters as input.
 * It chains these converters by finding a path of converters
 * that can go from the given content-type to the given type preferences.
 * In case there are multiple paths, the one with the highest weight gets found.
 * Will error in case no path can be found.
 *
 * This is not a TypedRepresentationConverter since the supported output types
 * might depend on what is the input content-type.
 *
 * This converter should be the last in a WaterfallHandler if there are multiple,
 * since it will try to convert any representation with a content-type.
 *
 * Some suggestions on how this class can be even more optimized should this ever be needed in the future.
 * Most of these decrease computation time at the cost of more memory.
 *  - The algorithm could start on both ends of a possible path and work towards the middle.
 *  - When creating a path, store the list of unused converters instead of checking every step.
 *  - Caching: https://github.com/solid/community-server/issues/832
 */
export declare class ChainedConverter extends RepresentationConverter {
    protected readonly logger: import("../..").Logger;
    private readonly converters;
    constructor(converters: TypedRepresentationConverter[]);
    canHandle(input: RepresentationConverterArgs): Promise<void>;
    handle(input: RepresentationConverterArgs): Promise<Representation>;
    private isMatchedPath;
    /**
     * Finds a conversion path that can handle the given input.
     */
    private findPath;
    /**
     * Tries to generate the optimal `ConversionPath` that supports the given parameters,
     * which will then be used to instantiate a specific `MatchedPath` for those parameters.
     *
     * Errors if such a path does not exist.
     */
    private generatePath;
    /**
     * Finds the path from the given list that can convert the given type to the given preferences.
     * If there are multiple matches the one with the highest result weight gets chosen.
     * Will return undefined if there are no matches.
     */
    private findBest;
    /**
     * Filter out paths that can no longer be better than the current best solution.
     * This depends on a valid path already being found, if not all the input paths will be returned.
     *
     * @param paths - Paths to filter.
     * @param maxWeight - The maximum weight in the output preferences.
     * @param inType - The input type.
     * @param bestMatch - The current best path.
     */
    private removeBadPaths;
    /**
     * Finds all converters that could take the output of the given path as input.
     * For each of these converters a new path gets created which is the input path appended by the converter.
     */
    private takeStep;
    /**
     * Creates a new ValuePreferences object, which is equal to the input object
     * with all values multiplied by the given weight.
     */
    private modifyTypeWeights;
    /**
     * Finds all converters in the given list that support taking any of the given types as input.
     */
    private supportedConverters;
}
