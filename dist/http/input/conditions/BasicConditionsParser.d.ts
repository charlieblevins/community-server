import type { HttpRequest } from '../../../server/HttpRequest';
import type { Conditions } from '../../../storage/Conditions';
import { ConditionsParser } from './ConditionsParser';
/**
 * Creates a Conditions object based on the the following headers:
 *  - If-Modified-Since
 *  - If-Unmodified-Since
 *  - If-Match
 *  - If-None-Match
 *
 * Implementation based on RFC7232
 */
export declare class BasicConditionsParser extends ConditionsParser {
    protected readonly logger: import("../../..").Logger;
    handle(request: HttpRequest): Promise<Conditions | undefined>;
    /**
     * Converts a request header containing a datetime string to an actual Date object.
     * Undefined if there is no value for the given header name.
     */
    private parseDateHeader;
    /**
     * Converts a request header containing ETags to an array of ETags.
     * Undefined if there is no value for the given header name.
     */
    private parseTagHeader;
}
