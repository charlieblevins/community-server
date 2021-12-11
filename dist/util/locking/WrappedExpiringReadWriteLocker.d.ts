import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { ExpiringReadWriteLocker } from './ExpiringReadWriteLocker';
import type { ReadWriteLocker } from './ReadWriteLocker';
/**
 * Wraps around an existing {@link ReadWriteLocker} and adds expiration logic to prevent locks from getting stuck.
 */
export declare class WrappedExpiringReadWriteLocker implements ExpiringReadWriteLocker {
    protected readonly logger: import("../..").Logger;
    protected readonly locker: ReadWriteLocker;
    protected readonly expiration: number;
    /**
     * @param locker - Instance of ResourceLocker to use for acquiring a lock.
     * @param expiration - Time in ms after which the lock expires.
     */
    constructor(locker: ReadWriteLocker, expiration: number);
    withReadLock<T>(identifier: ResourceIdentifier, whileLocked: (maintainLock: () => void) => T | Promise<T>): Promise<T>;
    withWriteLock<T>(identifier: ResourceIdentifier, whileLocked: (maintainLock: () => void) => T | Promise<T>): Promise<T>;
    /**
     * Creates a Promise that either resolves the given input function or rejects if time runs out,
     * whichever happens first. The input function can reset the timer by calling the `maintainLock` function
     * it receives. The ResourceIdentifier is only used for logging.
     */
    private expiringPromise;
}
