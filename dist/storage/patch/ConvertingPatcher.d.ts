import type { Representation } from '../../http/representation/Representation';
import type { RepresentationConverter } from '../conversion/RepresentationConverter';
import type { RepresentationPatcherInput } from './RepresentationPatcher';
import { RepresentationPatcher } from './RepresentationPatcher';
/**
 * A `ConvertingPatcher` converts a document to its `intermediateType`,
 * sends the result to the wrapped patcher, and then converts back to its original type.
 * No changes will take place if no `intermediateType` is provided.
 *
 * In case there is no resource yet and a new one needs to be created,
 * the result of the wrapped patcher will be converted to the provided `defaultType`.
 * In case no `defaultType` is provided, the patcher output will be returned directly.
 */
export declare class ConvertingPatcher extends RepresentationPatcher {
    protected readonly logger: import("../..").Logger;
    private readonly patcher;
    private readonly converter;
    private readonly intermediateType?;
    private readonly defaultType?;
    /**
     * @param patcher - Patcher that will be called with the Representation.
     * @param converter - Converter that will be used to generate intermediate Representation.
     * @param intermediateType - Content-type of the intermediate Representation if conversion is needed.
     * @param defaultType - Content-type in case a new resource gets created and needs to be converted.
     */
    constructor(patcher: RepresentationPatcher, converter: RepresentationConverter, intermediateType?: string, defaultType?: string);
    canHandle(input: RepresentationPatcherInput): Promise<void>;
    handle(input: RepresentationPatcherInput): Promise<Representation>;
}
