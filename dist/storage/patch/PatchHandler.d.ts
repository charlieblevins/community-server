import type { Patch } from '../../http/representation/Patch';
import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import { AsyncHandler } from '../../util/handlers/AsyncHandler';
import type { ModifiedResource, ResourceStore } from '../ResourceStore';
export declare type PatchHandlerInput<T extends ResourceStore = ResourceStore> = {
    source: T;
    identifier: ResourceIdentifier;
    patch: Patch;
};
/**
 * Executes the given Patch.
 */
export declare abstract class PatchHandler<T extends ResourceStore = ResourceStore> extends AsyncHandler<PatchHandlerInput<T>, ModifiedResource[]> {
}
