import type { AsyncHandler } from './AsyncHandler';
/**
 * A composite handler that tries multiple handlers one by one
 * until it finds a handler that supports the input.
 * The handlers will be checked in the order they appear in the input array,
 * allowing for more fine-grained handlers to check before catch-all handlers.
 */
export declare class WaterfallHandler<TIn, TOut> implements AsyncHandler<TIn, TOut> {
    protected readonly logger: import("../..").Logger;
    private readonly handlers;
    /**
     * Creates a new WaterfallHandler that stores the given handlers.
     * @param handlers - Handlers over which it will run.
     */
    constructor(handlers: AsyncHandler<TIn, TOut>[]);
    /**
     * Checks if any of the stored handlers can handle the given input.
     * @param input - The data that would need to be handled.
     *
     * @returns A promise resolving if at least 1 handler supports to input, or rejecting if none do.
     */
    canHandle(input: TIn): Promise<void>;
    /**
     * Finds a handler that supports the given input and then lets it handle the given data.
     * @param input - The data that needs to be handled.
     *
     * @returns A promise corresponding to the handle call of a handler that supports the input.
     * It rejects if no handlers support the given data.
     */
    handle(input: TIn): Promise<TOut>;
    /**
     * Identical to {@link AsyncHandler.handleSafe} but optimized for composite
     * by only needing 1 canHandle call on members.
     * @param input - The input data.
     *
     * @returns A promise corresponding to the handle call of a handler that supports the input.
     * It rejects if no handlers support the given data.
     */
    handleSafe(input: TIn): Promise<TOut>;
}
