import type { ResourceIdentifier } from '../http/representation/ResourceIdentifier';
import type { ResourceStore } from '../storage/ResourceStore';
import type { ResourcesGenerator } from './generate/ResourcesGenerator';
import type { PodManager } from './PodManager';
import type { PodSettings } from './settings/PodSettings';
/**
 * Pod manager that uses an {@link IdentifierGenerator} and {@link ResourcesGenerator}
 * to create the default resources and identifier for a new pod.
 */
export declare class GeneratedPodManager implements PodManager {
    protected readonly logger: import("..").Logger;
    private readonly store;
    private readonly resourcesGenerator;
    constructor(store: ResourceStore, resourcesGenerator: ResourcesGenerator);
    /**
     * Creates a new pod, pre-populating it with the resources created by the data generator.
     * Will throw an error if the given identifier already has a resource.
     */
    createPod(identifier: ResourceIdentifier, settings: PodSettings, overwrite: boolean): Promise<void>;
}
