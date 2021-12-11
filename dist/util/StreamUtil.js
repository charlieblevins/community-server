"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardedStreamFrom = exports.transformSafely = exports.pipeSafely = exports.getSingleItem = exports.readJsonStream = exports.readableToQuads = exports.readableToString = exports.endOfStream = void 0;
const stream_1 = require("stream");
const util_1 = require("util");
const arrayify_stream_1 = __importDefault(require("arrayify-stream"));
const end_of_stream_1 = __importDefault(require("end-of-stream"));
const n3_1 = require("n3");
const pump_1 = __importDefault(require("pump"));
const LogUtil_1 = require("../logging/LogUtil");
const HttpRequest_1 = require("../server/HttpRequest");
const InternalServerError_1 = require("./errors/InternalServerError");
const GuardedStream_1 = require("./GuardedStream");
exports.endOfStream = util_1.promisify(end_of_stream_1.default);
const logger = LogUtil_1.getLoggerFor('StreamUtil');
/**
 * Joins all strings of a stream.
 * @param stream - Stream of strings.
 *
 * @returns The joined string.
 */
async function readableToString(stream) {
    return (await arrayify_stream_1.default(stream)).join('');
}
exports.readableToString = readableToString;
/**
 * Imports quads from a stream into a Store.
 * @param stream - Stream of quads.
 *
 * @returns A Store containing all the quads.
 */
async function readableToQuads(stream) {
    const quads = new n3_1.Store();
    quads.import(stream);
    await exports.endOfStream(stream);
    return quads;
}
exports.readableToQuads = readableToQuads;
/**
 * Interprets the stream as JSON and converts it to a Dict.
 * @param stream - Stream of JSON data.
 *
 * @returns The parsed object.
 */
async function readJsonStream(stream) {
    const body = await readableToString(stream);
    return JSON.parse(body);
}
exports.readJsonStream = readJsonStream;
/**
 * Converts the stream to a single object.
 * This assumes the stream is in object mode and only contains a single element,
 * otherwise an error will be thrown.
 * @param stream - Object stream with single entry.
 */
async function getSingleItem(stream) {
    const items = await arrayify_stream_1.default(stream);
    if (items.length !== 1) {
        throw new InternalServerError_1.InternalServerError('Expected a stream with a single object.');
    }
    return items[0];
}
exports.getSingleItem = getSingleItem;
// These error messages usually indicate expected behaviour so should not give a warning.
// We compare against the error message instead of the code
// since the second one is from an external library that does not assign an error code.
// At the time of writing the first one gets thrown in Node 16 and the second one in Node 14.
const safeErrors = new Set([
    'Cannot call write after a stream was destroyed',
    'premature close',
]);
/**
 * Pipes one stream into another and emits errors of the first stream with the second.
 * In case of an error in the first stream the second one will be destroyed with the given error.
 * This will also make the stream {@link Guarded}.
 * @param readable - Initial readable stream.
 * @param destination - The destination for writing data.
 * @param mapError - Optional function that takes the error and converts it to a new error.
 *
 * @returns The destination stream.
 */
function pipeSafely(readable, destination, mapError) {
    // We never want to closes the incoming HttpRequest if there is an error
    // since that also closes the outgoing HttpResponse.
    // Since `pump` sends stream errors both up and down the pipe chain,
    // in this case we need to make sure the error only goes down the chain.
    if (HttpRequest_1.isHttpRequest(readable)) {
        readable.pipe(destination);
        readable.on('error', (error) => {
            logger.warn(`HttpRequest errored with ${error.message}`);
            // From https://nodejs.org/api/stream.html#stream_readable_pipe_destination_options :
            // One important caveat is that if the Readable stream emits an error during processing,
            // the Writable destination is not closed automatically. If an error occurs,
            // it will be necessary to manually close each stream in order to prevent memory leaks.
            destination.destroy(mapError ? mapError(error) : error);
        });
    }
    else {
        // In case the input readable is guarded, it will no longer log errors since `pump` attaches a new error listener
        pump_1.default(readable, destination, (error) => {
            if (error) {
                const msg = `Piped stream errored with ${error.message}`;
                logger.log(safeErrors.has(error.message) ? 'debug' : 'warn', msg);
                // Make sure the final error can be handled in a normal streaming fashion
                destination.emit('error', mapError ? mapError(error) : error);
            }
        });
    }
    // Guarding the stream now means the internal error listeners of pump will be ignored
    // when checking if there is a valid error listener.
    return GuardedStream_1.guardStream(destination);
}
exports.pipeSafely = pipeSafely;
/**
 * Transforms a stream, ensuring that all errors are forwarded.
 * @param source - The stream to be transformed
 * @param options - The transformation options
 *
 * @returns The transformed stream
 */
function transformSafely(source, { transform = function (data) {
    this.push(data);
}, flush = () => null, ...options } = {}) {
    return pipeSafely(source, new stream_1.Transform({
        ...options,
        async transform(data, encoding, callback) {
            let error = null;
            try {
                await transform.call(this, data, encoding);
            }
            catch (err) {
                error = err;
            }
            callback(error);
        },
        async flush(callback) {
            let error = null;
            try {
                await flush.call(this);
            }
            catch (err) {
                error = err;
            }
            callback(error);
        },
    }));
}
exports.transformSafely = transformSafely;
/**
 * Converts a string or array to a stream and applies an error guard so that it is {@link Guarded}.
 * @param contents - Data to stream.
 * @param options - Options to pass to the Readable constructor. See {@link Readable.from}.
 */
function guardedStreamFrom(contents, options) {
    return GuardedStream_1.guardStream(stream_1.Readable.from(typeof contents === 'string' ? [contents] : contents, options));
}
exports.guardedStreamFrom = guardedStreamFrom;
//# sourceMappingURL=StreamUtil.js.map