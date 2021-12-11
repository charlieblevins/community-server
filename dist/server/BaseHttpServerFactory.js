"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHttpServerFactory = void 0;
const fs_1 = require("fs");
const http_1 = require("http");
const https_1 = require("https");
const url_1 = require("url");
const LogUtil_1 = require("../logging/LogUtil");
const ErrorUtil_1 = require("../util/errors/ErrorUtil");
const GuardedStream_1 = require("../util/GuardedStream");
/**
 * HttpServerFactory based on the native Node.js http module
 */
class BaseHttpServerFactory {
    constructor(handler, options = { https: false }) {
        this.logger = LogUtil_1.getLoggerFor(this);
        this.handler = handler;
        this.options = { ...options };
    }
    /**
     * Creates and starts an HTTP(S) server
     * @param port - Port on which the server listens
     */
    startServer(port) {
        const protocol = this.options.https ? 'https' : 'http';
        const url = new url_1.URL(`${protocol}://localhost:${port}/`).href;
        this.logger.info(`Starting server at ${url}`);
        const createServer = this.options.https ? https_1.createServer : http_1.createServer;
        const options = this.createServerOptions();
        const server = createServer(options, async (request, response) => {
            try {
                this.logger.info(`Received ${request.method} request for ${request.url}`);
                await this.handler.handleSafe({ request: GuardedStream_1.guardStream(request), response });
            }
            catch (error) {
                let errMsg;
                if (!ErrorUtil_1.isError(error)) {
                    errMsg = `Unknown error: ${error}.\n`;
                }
                else if (this.options.showStackTrace && error.stack) {
                    errMsg = `${error.stack}\n`;
                }
                else {
                    errMsg = `${error.name}: ${error.message}\n`;
                }
                this.logger.error(errMsg);
                if (response.headersSent) {
                    response.end();
                }
                else {
                    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
                    response.writeHead(500).end(errMsg);
                }
            }
            finally {
                if (!response.headersSent) {
                    response.writeHead(404).end();
                }
            }
        });
        return server.listen(port);
    }
    createServerOptions() {
        const options = { ...this.options };
        for (const id of ['key', 'cert', 'pfx']) {
            const val = options[id];
            if (val) {
                options[id] = fs_1.readFileSync(val, 'utf8');
            }
        }
        return options;
    }
}
exports.BaseHttpServerFactory = BaseHttpServerFactory;
//# sourceMappingURL=BaseHttpServerFactory.js.map