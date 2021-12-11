"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketAdvertiser = void 0;
const HeaderUtil_1 = require("../../util/HeaderUtil");
const HttpHandler_1 = require("../HttpHandler");
/**
 * Handler that advertises a WebSocket through the Updates-Via header.
 */
class WebSocketAdvertiser extends HttpHandler_1.HttpHandler {
    constructor(baseUrl) {
        super();
        const socketUrl = new URL(baseUrl);
        socketUrl.protocol = /^(?:http|ws):/u.test(baseUrl) ? 'ws:' : 'wss:';
        this.socketUrl = socketUrl.href;
    }
    async handle({ response }) {
        HeaderUtil_1.addHeader(response, 'Updates-Via', this.socketUrl);
    }
}
exports.WebSocketAdvertiser = WebSocketAdvertiser;
//# sourceMappingURL=WebSocketAdvertiser.js.map