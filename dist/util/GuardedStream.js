"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardStream = exports.isGuarded = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const logger = LogUtil_1.getLoggerFor('GuardedStream');
// Using symbols to make sure we don't override existing parameters
const guardedErrors = Symbol('guardedErrors');
const guardedTimeout = Symbol('guardedTimeout');
// Private fields for guarded streams
class Guard {
}
/**
 * Determines whether the stream is guarded from emitting errors.
 */
function isGuarded(stream) {
    return typeof stream[guardedErrors] === 'object';
}
exports.isGuarded = isGuarded;
/**
 * Callback that is used when a stream emits an error and no other error listener is attached.
 * Used to store the error and start the logger timer.
 *
 * It is important that this listener always remains attached for edge cases where an error listener gets removed
 * and the number of error listeners is checked immediately afterwards.
 * See https://github.com/solid/community-server/pull/462#issuecomment-758013492 .
 */
function guardingErrorListener(error) {
    // Only fall back to this if no new listeners are attached since guarding started.
    const errorListeners = this.listeners('error');
    if (errorListeners[errorListeners.length - 1] === guardingErrorListener) {
        this[guardedErrors].push(error);
        if (!this[guardedTimeout]) {
            this[guardedTimeout] = setTimeout(() => {
                const message = `No error listener was attached but error was thrown: ${error.message}`;
                logger.error(message, { error });
            }, 1000);
        }
    }
}
/**
 * Callback that is used when a new listener is attached and there are errors that were not emitted yet.
 */
function emitStoredErrors(event, func) {
    if (event === 'error' && func !== guardingErrorListener) {
        // Cancel an error timeout
        if (this[guardedTimeout]) {
            clearTimeout(this[guardedTimeout]);
            this[guardedTimeout] = undefined;
        }
        // Emit any errors that were guarded
        const errors = this[guardedErrors];
        if (errors.length > 0) {
            this[guardedErrors] = [];
            setImmediate(() => {
                for (const error of errors) {
                    this.emit('error', error);
                }
            });
        }
    }
}
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
function guardStream(stream) {
    const guarded = stream;
    if (!isGuarded(stream)) {
        guarded[guardedErrors] = [];
        guarded.on('error', guardingErrorListener);
        guarded.on('newListener', emitStoredErrors);
    }
    else {
        // This makes sure the guarding error listener is the last one in the list again
        guarded.removeListener('error', guardingErrorListener);
        guarded.on('error', guardingErrorListener);
    }
    return guarded;
}
exports.guardStream = guardStream;
//# sourceMappingURL=GuardedStream.js.map