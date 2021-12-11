import type { KeyValueStorage } from '../../../../storage/keyvalue/KeyValueStorage';
import type { AccountSettings, AccountStore } from './AccountStore';
/**
 * A payload to persist a user account
 */
export interface AccountPayload {
    webId: string;
    email: string;
    password: string;
    verified: boolean;
}
/**
 * A payload to persist the fact that a user
 * has requested to reset their password
 */
export interface ForgotPasswordPayload {
    email: string;
    recordId: string;
}
export declare type EmailPasswordData = AccountPayload | ForgotPasswordPayload | AccountSettings;
/**
 * A EmailPasswordStore that uses a KeyValueStorage
 * to persist its information.
 */
export declare class BaseAccountStore implements AccountStore {
    private readonly storage;
    private readonly saltRounds;
    constructor(storage: KeyValueStorage<string, EmailPasswordData>, saltRounds: number);
    /**
     * Generates a ResourceIdentifier to store data for the given email.
     */
    private getAccountResourceIdentifier;
    /**
     * Generates a ResourceIdentifier to store data for the given recordId.
     */
    private getForgotPasswordRecordResourceIdentifier;
    /**
     * Helper function that converts the given e-mail to an account identifier
     * and retrieves the account data from the internal storage.
     *
     * Will error if `checkExistence` is true and the account does not exist.
     */
    private getAccountPayload;
    authenticate(email: string, password: string): Promise<string>;
    create(email: string, webId: string, password: string, settings: AccountSettings): Promise<void>;
    verify(email: string): Promise<void>;
    changePassword(email: string, password: string): Promise<void>;
    getSettings(webId: string): Promise<AccountSettings>;
    updateSettings(webId: string, settings: AccountSettings): Promise<void>;
    deleteAccount(email: string): Promise<void>;
    generateForgotPasswordRecord(email: string): Promise<string>;
    getForgotPasswordRecord(recordId: string): Promise<string | undefined>;
    deleteForgotPasswordRecord(recordId: string): Promise<void>;
}
