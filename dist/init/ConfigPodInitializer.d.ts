import type { ComponentsJsFactory } from '../pods/generate/ComponentsJsFactory';
import type { KeyValueStorage } from '../storage/keyvalue/KeyValueStorage';
import type { ResourceStore } from '../storage/ResourceStore';
import { Initializer } from './Initializer';
/**
 * Initializes all pods that have been stored and loads them in memory.
 * This reads the pod settings from a permanent storage and uses those
 * to create the corresponding ResourceStores in memory,
 * so this is required every time the server starts.
 *
 * Part of the dynamic pod creation.
 * Reads the contents from the configuration storage, uses those values to instantiate ResourceStores,
 * and then adds them to the routing storage.
 * @see {@link ConfigPodManager}, {@link TemplatedPodGenerator}, {@link BaseUrlRouterRule}
 */
export declare class ConfigPodInitializer extends Initializer {
    protected readonly logger: import("..").Logger;
    private readonly storeFactory;
    private readonly configStorage;
    private readonly routingStorage;
    constructor(storeFactory: ComponentsJsFactory, configStorage: KeyValueStorage<string, unknown>, routingStorage: KeyValueStorage<string, ResourceStore>);
    handle(): Promise<void>;
}
