import type { RepresentationConverter } from '../../../storage/conversion/RepresentationConverter';
import type { ResponseDescription } from '../response/ResponseDescription';
import type { ErrorHandlerArgs } from './ErrorHandler';
import { ErrorHandler } from './ErrorHandler';
/**
 * Converts an error into a Representation of content type internal/error.
 * Then feeds that representation into its converter to create a representation based on the given preferences.
 */
export declare class ConvertingErrorHandler extends ErrorHandler {
    private readonly converter;
    private readonly showStackTrace;
    constructor(converter: RepresentationConverter, showStackTrace?: boolean);
    canHandle(input: ErrorHandlerArgs): Promise<void>;
    handle(input: ErrorHandlerArgs): Promise<ResponseDescription>;
    handleSafe(input: ErrorHandlerArgs): Promise<ResponseDescription>;
    /**
     * Prepares the arguments used by all functions.
     */
    private prepareArguments;
    /**
     * Creates a ResponseDescription based on the Representation.
     */
    private createResponse;
    /**
     * Creates a Representation based on the given error.
     * Content type will be internal/error.
     * The status code is used for metadata.
     */
    private toRepresentation;
}
