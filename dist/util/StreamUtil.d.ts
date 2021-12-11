/// <reference types="node" />
import type { Writable, ReadableOptions, DuplexOptions } from 'stream';
import { Readable, Transform } from 'stream';
import { Store } from 'n3';
import type { Guarded } from './GuardedStream';
export declare const endOfStream: (arg1: NodeJS.ReadableStream | NodeJS.WritableStream) => Promise<void>;
/**
 * Joins all strings of a stream.
 * @param stream - Stream of strings.
 *
 * @returns The joined string.
 */
export declare function readableToString(stream: Readable): Promise<string>;
/**
 * Imports quads from a stream into a Store.
 * @param stream - Stream of quads.
 *
 * @returns A Store containing all the quads.
 */
export declare function readableToQuads(stream: Readable): Promise<Store>;
/**
 * Interprets the stream as JSON and converts it to a Dict.
 * @param stream - Stream of JSON data.
 *
 * @returns The parsed object.
 */
export declare function readJsonStream(stream: Readable): Promise<NodeJS.Dict<any>>;
/**
 * Converts the stream to a single object.
 * This assumes the stream is in object mode and only contains a single element,
 * otherwise an error will be thrown.
 * @param stream - Object stream with single entry.
 */
export declare function getSingleItem(stream: Readable): Promise<unknown>;
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
export declare function pipeSafely<T extends Writable>(readable: NodeJS.ReadableStream, destination: T, mapError?: (error: Error) => Error): Guarded<T>;
export interface AsyncTransformOptions<T = any> extends DuplexOptions {
    /**
     * Transforms data from the source by calling the `push` method
     */
    transform?: (this: Transform, data: T, encoding: string) => any | Promise<any>;
    /**
     * Performs any final actions after the source has ended
     */
    flush?: (this: Transform) => any | Promise<any>;
}
/**
 * Transforms a stream, ensuring that all errors are forwarded.
 * @param source - The stream to be transformed
 * @param options - The transformation options
 *
 * @returns The transformed stream
 */
export declare function transformSafely<T = any>(source: NodeJS.ReadableStream, { transform, flush, ...options }?: AsyncTransformOptions<T>): Guarded<Transform>;
/**
 * Converts a string or array to a stream and applies an error guard so that it is {@link Guarded}.
 * @param contents - Data to stream.
 * @param options - Options to pass to the Readable constructor. See {@link Readable.from}.
 */
export declare function guardedStreamFrom(contents: string | Iterable<any>, options?: ReadableOptions): Guarded<Readable>;
