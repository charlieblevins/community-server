import type { Adapter, AdapterPayload } from 'oidc-provider';
import type { ExpiringStorage } from '../../storage/keyvalue/ExpiringStorage';
import type { AdapterFactory } from './AdapterFactory';
/**
 * An IDP storage adapter that uses an ExpiringStorage
 * to persist data.
 */
export declare class ExpiringAdapter implements Adapter {
    protected readonly logger: import("../..").Logger;
    private readonly name;
    private readonly storage;
    constructor(name: string, storage: ExpiringStorage<string, unknown>);
    private grantKeyFor;
    private userCodeKeyFor;
    private uidKeyFor;
    private keyFor;
    upsert(id: string, payload: AdapterPayload, expiresIn?: number): Promise<void>;
    find(id: string): Promise<AdapterPayload | void>;
    findByUserCode(userCode: string): Promise<AdapterPayload | void>;
    findByUid(uid: string): Promise<AdapterPayload | void>;
    destroy(id: string): Promise<void>;
    revokeByGrantId(grantId: string): Promise<void>;
    consume(id: string): Promise<void>;
}
/**
 * The factory for a ExpiringStorageAdapter
 */
export declare class ExpiringAdapterFactory implements AdapterFactory {
    private readonly storage;
    constructor(storage: ExpiringStorage<string, unknown>);
    createStorageAdapter(name: string): ExpiringAdapter;
}
