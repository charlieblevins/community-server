"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerInitializer = void 0;
const util_1 = require("util");
const Initializer_1 = require("./Initializer");
/**
 * Creates and starts an HTTP server.
 */
class ServerInitializer extends Initializer_1.Initializer {
    constructor(serverFactory, port) {
        super();
        this.serverFactory = serverFactory;
        this.port = port;
    }
    async handle() {
        this.server = this.serverFactory.startServer(this.port);
    }
    async finalize() {
        if (this.server) {
            return util_1.promisify(this.server.close.bind(this.server))();
        }
    }
}
exports.ServerInitializer = ServerInitializer;
//# sourceMappingURL=ServerInitializer.js.map