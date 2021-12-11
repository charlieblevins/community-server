/// <reference types="node" />
import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { ResourceStore } from '../../storage/ResourceStore';
import type { ResourcesGenerator } from './ResourcesGenerator';
/**
 * Generates resources with the given generator and adds them to the given store.
 * @param identifier - Identifier of the pod.
 * @param settings - Settings from which the pod is being created.
 * @param generator - Generator to be used.
 * @param store - Store to be updated.
 *
 * @returns The amount of resources that were added.
 */
export declare function addGeneratedResources(identifier: ResourceIdentifier, settings: NodeJS.Dict<string>, generator: ResourcesGenerator, store: ResourceStore): Promise<number>;
