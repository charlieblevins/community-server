"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoidLogger = void 0;
const Logger_1 = require("./Logger");
/**
 * A logger that does nothing on a log message.
 */
class VoidLogger extends Logger_1.Logger {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    log(level, message, meta) {
        // Do nothing
        return this;
    }
}
exports.VoidLogger = VoidLogger;
//# sourceMappingURL=VoidLogger.js.map