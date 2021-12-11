import { AsyncHandler } from './AsyncHandler';
/**
 * A composite handler that returns true if any of its handlers can handle the input and return true.
 * Handler errors are interpreted as false results.
 */
export declare class BooleanHandler<TIn> extends AsyncHandler<TIn, boolean> {
    protected readonly logger: import("../..").Logger;
    private readonly handlers;
    /**
     * Creates a new BooleanHandler that stores the given handlers.
     * @param handlers - Handlers over which it will run.
     */
    constructor(handlers: AsyncHandler<TIn, boolean>[]);
    canHandle(input: TIn): Promise<void>;
    handleSafe(input: TIn): Promise<boolean>;
    handle(input: TIn): Promise<boolean>;
}
