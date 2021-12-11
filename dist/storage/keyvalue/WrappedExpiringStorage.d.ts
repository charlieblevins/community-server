import type { Finalizable } from '../../init/final/Finalizable';
import type { ExpiringStorage } from './ExpiringStorage';
import type { KeyValueStorage } from './KeyValueStorage';
export declare type Expires<T> = {
    expires?: string;
    payload: T;
};
/**
 * A storage that wraps around another storage and expires resources based on the given (optional) expiry date.
 * Will delete expired entries when trying to get their value.
 * Has a timer that will delete all expired data every hour (default value).
 */
export declare class WrappedExpiringStorage<TKey, TValue> implements ExpiringStorage<TKey, TValue>, Finalizable {
    protected readonly logger: import("../..").Logger;
    private readonly source;
    private readonly timer;
    /**
     * @param source - KeyValueStorage to actually store the data.
     * @param timeout - How often the expired data needs to be checked in minutes.
     */
    constructor(source: KeyValueStorage<TKey, Expires<TValue>>, timeout?: number);
    get(key: TKey): Promise<TValue | undefined>;
    has(key: TKey): Promise<boolean>;
    set(key: TKey, value: TValue, expiration?: number): Promise<this>;
    set(key: TKey, value: TValue, expires?: Date): Promise<this>;
    delete(key: TKey): Promise<boolean>;
    entries(): AsyncIterableIterator<[TKey, TValue]>;
    /**
     * Deletes all entries that have expired.
     */
    private removeExpiredEntries;
    /**
     * Tries to get the data for the given key.
     * In case the data exists but has expired,
     * it will be deleted and `undefined` will be returned instead.
     */
    private getUnexpired;
    /**
     * Checks if the given data entry has expired.
     */
    private isExpired;
    /**
     * Creates a new object where the `expires` field is a string instead of a Date.
     */
    private toExpires;
    /**
     * Creates a new object where the `expires` field is a Date instead of a string.
     */
    private toData;
    /**
     * Stops the continuous cleanup timer.
     */
    finalize(): Promise<void>;
}
