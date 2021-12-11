"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreedyReadWriteLocker = void 0;
const ForbiddenHttpError_1 = require("../errors/ForbiddenHttpError");
const InternalServerError_1 = require("../errors/InternalServerError");
/**
 * A {@link ReadWriteLocker} that allows for multiple simultaneous read operations.
 * Write operations will be blocked as long as read operations are not finished.
 * New read operations are allowed while this is going on, which will cause write operations to wait longer.
 *
 * Based on https://en.wikipedia.org/wiki/Readers%E2%80%93writer_lock#Using_two_mutexes .
 * As soon as 1 read lock request is made, the write lock is locked.
 * Internally a counter keeps track of the amount of active read locks.
 * Only when this number reaches 0 will the write lock be released again.
 * The internal read lock is only locked to increase/decrease this counter and is released afterwards.
 * This allows for multiple read operations, although only 1 at the time can update the counter,
 * which means there can still be a small waiting period if there are multiple simultaneous read operations.
 */
class GreedyReadWriteLocker {
    /**
     * @param locker - Used for creating read and write locks.
     * @param storage - Used for storing the amount of active read operations on a resource.
     * @param suffixes - Used to generate identifiers with the given suffixes.
     *                   `count` is used for the identifier used to store the counter.
     *                   `read` and `write` are used for the 2 types of locks that are needed.
     */
    constructor(locker, storage, suffixes = { count: 'count', read: 'read', write: 'write' }) {
        this.locker = locker;
        this.storage = storage;
        this.suffixes = suffixes;
    }
    async withReadLock(identifier, whileLocked) {
        await this.preReadSetup(identifier);
        try {
            return await whileLocked();
        }
        finally {
            await this.postReadCleanup(identifier);
        }
    }
    async withWriteLock(identifier, whileLocked) {
        if (identifier.path.endsWith(`.${this.suffixes.count}`)) {
            throw new ForbiddenHttpError_1.ForbiddenHttpError('This resource is used for internal purposes.');
        }
        const write = this.getWriteLockKey(identifier);
        await this.locker.acquire(write);
        try {
            return await whileLocked();
        }
        finally {
            await this.locker.release(write);
        }
    }
    /**
     * This key is used for storing the count of active read operations.
     */
    getCountKey(identifier) {
        return `${identifier.path}.${this.suffixes.count}`;
    }
    /**
     * This is the identifier for the read lock: the lock that is used to safely update and read the count.
     */
    getReadLockKey(identifier) {
        return { path: `${identifier.path}.${this.suffixes.read}` };
    }
    /**
     * This is the identifier for the write lock, making sure there is at most 1 write operation active.
     */
    getWriteLockKey(identifier) {
        return { path: `${identifier.path}.${this.suffixes.write}` };
    }
    /**
     * Safely updates the count before starting a read operation.
     */
    async preReadSetup(identifier) {
        await this.withInternalReadLock(identifier, async () => {
            const count = await this.incrementCount(identifier, +1);
            if (count === 1) {
                // There is at least 1 read operation so write operations are blocked
                const write = this.getWriteLockKey(identifier);
                await this.locker.acquire(write);
            }
        });
    }
    /**
     * Safely decreases the count after the read operation is finished.
     */
    async postReadCleanup(identifier) {
        await this.withInternalReadLock(identifier, async () => {
            const count = await this.incrementCount(identifier, -1);
            if (count === 0) {
                // All read locks have been released so a write operation is possible again
                const write = this.getWriteLockKey(identifier);
                await this.locker.release(write);
            }
        });
    }
    /**
     * Safely runs an action on the count.
     */
    async withInternalReadLock(identifier, whileLocked) {
        const read = this.getReadLockKey(identifier);
        await this.locker.acquire(read);
        try {
            return await whileLocked();
        }
        finally {
            await this.locker.release(read);
        }
    }
    /**
     * Updates the count with the given modifier.
     * Creates the data if it didn't exist yet.
     * Deletes the data when the count reaches zero.
     */
    async incrementCount(identifier, mod) {
        var _a;
        const countKey = this.getCountKey(identifier);
        let number = (_a = await this.storage.get(countKey)) !== null && _a !== void 0 ? _a : 0;
        number += mod;
        if (number === 0) {
            // Make sure there is no remaining data once all locks are released
            await this.storage.delete(countKey);
        }
        else if (number > 0) {
            await this.storage.set(countKey, number);
        }
        else {
            // Failsafe in case something goes wrong with the count storage
            throw new InternalServerError_1.InternalServerError('Read counter would become negative. Something is wrong with the count storage.');
        }
        return number;
    }
}
exports.GreedyReadWriteLocker = GreedyReadWriteLocker;
//# sourceMappingURL=GreedyReadWriteLocker.js.map