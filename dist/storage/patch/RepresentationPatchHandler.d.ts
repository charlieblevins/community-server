import type { ModifiedResource } from '../ResourceStore';
import type { PatchHandlerInput } from './PatchHandler';
import { PatchHandler } from './PatchHandler';
import type { RepresentationPatcher } from './RepresentationPatcher';
/**
 * Handles a patch operation by getting the representation from the store, applying a `RepresentationPatcher`,
 * and then writing the result back to the store.
 *
 * In case there is no original representation (the store throws a `NotFoundHttpError`),
 * the patcher is expected to create a new one.
 */
export declare class RepresentationPatchHandler extends PatchHandler {
    protected readonly logger: import("../..").Logger;
    private readonly patcher;
    constructor(patcher: RepresentationPatcher);
    handle({ source, patch, identifier }: PatchHandlerInput): Promise<ModifiedResource[]>;
}
