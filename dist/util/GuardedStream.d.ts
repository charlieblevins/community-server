/// <reference types="node" />
declare const guardedErrors: unique symbol;
declare const guardedTimeout: unique symbol;
declare class Guard {
    private [guardedErrors];
    private [guardedTimeout]?;
}
/**
 * A stream that is guarded from emitting errors when there are no listeners.
 * If an error occurs while no listener is attached,
 * it will store the error and emit it once a listener is added (or a timeout occurs).
 */
export declare type Guarded<T extends NodeJS.EventEmitter = NodeJS.EventEmitter> = T & Guard;
/**
 * Determines whether the stream is guarded from emitting errors.
 */
export declare function isGuarded<T extends NodeJS.EventEmitter>(stream: T): stream is Guarded<T>;
/**
 * Makes sure that listeners always receive the error event of a stream,
 * even if it was thrown before the listener was attached.
 *
 * When guarding a stream it is assumed that error listeners already attached should be ignored,
 * only error listeners attached after the stream is guarded will prevent an error from being logged.
 *
 * If the input is already guarded the guard will be reset,
 * which means ignoring error listeners already attached.
 *
 * @param stream - Stream that can potentially throw an error.
 *
 * @returns The stream.
 */
export declare function guardStream<T extends NodeJS.EventEmitter>(stream: T): Guarded<T>;
export {};
