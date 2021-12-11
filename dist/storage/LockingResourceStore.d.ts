/// <reference types="node" />
import type { Readable } from 'stream';
import type { AuxiliaryIdentifierStrategy } from '../http/auxiliary/AuxiliaryIdentifierStrategy';
import type { Patch } from '../http/representation/Patch';
import type { Representation } from '../http/representation/Representation';
import type { RepresentationPreferences } from '../http/representation/RepresentationPreferences';
import type { ResourceIdentifier } from '../http/representation/ResourceIdentifier';
import type { ExpiringReadWriteLocker } from '../util/locking/ExpiringReadWriteLocker';
import type { AtomicResourceStore } from './AtomicResourceStore';
import type { Conditions } from './Conditions';
import type { ModifiedResource, ResourceStore } from './ResourceStore';
/**
 * Store that for every call acquires a lock before executing it on the requested resource,
 * and releases it afterwards.
 * In case the request returns a Representation the lock will only be released when the data stream is finished.
 *
 * For auxiliary resources the lock will be applied to the subject resource.
 * The actual operation is still executed on the auxiliary resource.
 */
export declare class LockingResourceStore implements AtomicResourceStore {
    protected readonly logger: import("..").Logger;
    private readonly source;
    private readonly locks;
    private readonly auxiliaryStrategy;
    constructor(source: ResourceStore, locks: ExpiringReadWriteLocker, auxiliaryStrategy: AuxiliaryIdentifierStrategy);
    resourceExists(identifier: ResourceIdentifier, conditions?: Conditions): Promise<boolean>;
    getRepresentation(identifier: ResourceIdentifier, preferences: RepresentationPreferences, conditions?: Conditions): Promise<Representation>;
    addResource(container: ResourceIdentifier, representation: Representation, conditions?: Conditions): Promise<ModifiedResource>;
    setRepresentation(identifier: ResourceIdentifier, representation: Representation, conditions?: Conditions): Promise<ModifiedResource[]>;
    deleteResource(identifier: ResourceIdentifier, conditions?: Conditions): Promise<ModifiedResource[]>;
    modifyResource(identifier: ResourceIdentifier, patch: Patch, conditions?: Conditions): Promise<ModifiedResource[]>;
    /**
     * Acquires the correct identifier to lock this resource.
     * For auxiliary resources this means the subject identifier.
     */
    protected getLockIdentifier(identifier: ResourceIdentifier): ResourceIdentifier;
    /**
     * Acquires a lock that is only released when all data of the resulting representation data has been read,
     * an error occurs, or the timeout has been triggered.
     * The resulting data stream will be adapted to reset the timer every time data is read.
     *
     * In case the data of the resulting stream is not needed it should be closed to prevent a timeout error.
     *
     * @param identifier - Identifier that should be locked.
     * @param whileLocked - Function to be executed while the resource is locked.
     */
    protected lockedRepresentationRun(identifier: ResourceIdentifier, whileLocked: () => Promise<Representation>): Promise<Representation>;
    /**
     * Wraps a representation to make it reset the timeout timer every time data is read.
     *
     * @param representation - The representation to wrap
     * @param maintainLock - Function to call to reset the timer.
     */
    protected createExpiringRepresentation(representation: Representation, maintainLock: () => void): Representation;
    /**
     * Returns a promise that resolve when the source stream is finished,
     * either by ending or emitting an error.
     * In the case of an error the stream will be destroyed if it hasn't been already.
     *
     * @param source - The input stream.
     */
    protected waitForStreamToEnd(source: Readable): Promise<void>;
}
