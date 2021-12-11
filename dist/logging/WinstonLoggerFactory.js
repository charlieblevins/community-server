"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonLoggerFactory = void 0;
const winston_1 = require("winston");
const WinstonLogger_1 = require("./WinstonLogger");
/**
 * Uses the winston library to create loggers for the given logging level.
 * By default, it will print to the console with colorized logging levels.
 *
 * This creates instances of {@link WinstonLogger}.
 */
class WinstonLoggerFactory {
    constructor(level) {
        this.level = level;
    }
    createLogger(label) {
        return new WinstonLogger_1.WinstonLogger(winston_1.createLogger({
            level: this.level,
            format: winston_1.format.combine(winston_1.format.label({ label }), winston_1.format.colorize(), winston_1.format.timestamp(), winston_1.format.printf(({ level: levelInner, message, label: labelInner, timestamp }) => `${timestamp} [${labelInner}] ${levelInner}: ${message}`)),
            transports: this.createTransports(),
        }));
    }
    createTransports() {
        return [new winston_1.transports.Console()];
    }
}
exports.WinstonLoggerFactory = WinstonLoggerFactory;
//# sourceMappingURL=WinstonLoggerFactory.js.map