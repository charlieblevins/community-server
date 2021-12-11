import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { ResourceLocker } from './ResourceLocker';
/**
 * A resource locker making use of the `async-lock` library.
 * Note that all locks are kept in memory until they are unlocked which could potentially result
 * in a memory leak if locks are never unlocked, so make sure this is covered with expiring locks for example,
 * and/or proper `finally` handles.
 */
export declare class SingleThreadedResourceLocker implements ResourceLocker {
    protected readonly logger: import("../..").Logger;
    private readonly locker;
    private readonly unlockCallbacks;
    constructor();
    acquire(identifier: ResourceIdentifier): Promise<void>;
    release(identifier: ResourceIdentifier): Promise<void>;
    /**
     * Counts the number of active locks.
     */
    private getLockCount;
}
