"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionHandler = void 0;
const ContentTypes_1 = require("../../../../util/ContentTypes");
const NotImplementedHttpError_1 = require("../../../../util/errors/NotImplementedHttpError");
const AsyncHandler_1 = require("../../../../util/handlers/AsyncHandler");
/**
 * Handler used for IDP interactions.
 * Only supports JSON data.
 */
class InteractionHandler extends AsyncHandler_1.AsyncHandler {
    async canHandle({ operation }) {
        var _a;
        if (((_a = operation.body) === null || _a === void 0 ? void 0 : _a.metadata.contentType) !== ContentTypes_1.APPLICATION_JSON) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Only application/json data is supported.');
        }
    }
}
exports.InteractionHandler = InteractionHandler;
//# sourceMappingURL=InteractionHandler.js.map