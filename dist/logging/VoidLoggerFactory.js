"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoidLoggerFactory = void 0;
const VoidLogger_1 = require("./VoidLogger");
/**
 * A factory that always returns {@link VoidLogger}, which does nothing on log messages.
 */
class VoidLoggerFactory {
    constructor() {
        this.logger = new VoidLogger_1.VoidLogger();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createLogger(label) {
        return this.logger;
    }
}
exports.VoidLoggerFactory = VoidLoggerFactory;
//# sourceMappingURL=VoidLoggerFactory.js.map