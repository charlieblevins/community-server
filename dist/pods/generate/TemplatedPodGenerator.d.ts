import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { KeyValueStorage } from '../../storage/keyvalue/KeyValueStorage';
import type { ResourceStore } from '../../storage/ResourceStore';
import type { PodSettings } from '../settings/PodSettings';
import type { ComponentsJsFactory } from './ComponentsJsFactory';
import type { PodGenerator } from './PodGenerator';
import type { VariableHandler } from './variables/VariableHandler';
/**
 * Creates a new ResourceStore when creating a pod based on a Components.js configuration.
 *
 * Part of the dynamic pod creation.
 *  1. It calls a VariableHandler to add necessary variable values.
 *     E.g. setting the base url variable for components.js to the pod identifier.
 *  2. It filters/cleans the input agent values using {@link VariableHandler}s
 *  3. It calls a ComponentsJsFactory with the variables and template location to instantiate a new ResourceStore.
 *  4. It stores these values in the configuration storage, which is used as a permanent storage for pod configurations.
 *
 * @see {@link ConfigPodManager}, {@link ConfigPodInitializer}, {@link BaseUrlRouterRule}
 */
export declare class TemplatedPodGenerator implements PodGenerator {
    protected readonly logger: import("../..").Logger;
    private readonly storeFactory;
    private readonly variableHandler;
    private readonly configStorage;
    private readonly configTemplatePath;
    /**
     * @param storeFactory - Factory used for Components.js instantiation.
     * @param variableHandler - Handler used for setting variable values.
     * @param configStorage - Where to store the configuration values to instantiate the store for this pod.
     * @param configTemplatePath - Where to find the configuration templates.
     */
    constructor(storeFactory: ComponentsJsFactory, variableHandler: VariableHandler, configStorage: KeyValueStorage<string, unknown>, configTemplatePath?: string);
    generate(identifier: ResourceIdentifier, settings: PodSettings): Promise<ResourceStore>;
}
