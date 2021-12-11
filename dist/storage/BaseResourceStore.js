"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResourceStore = void 0;
const NotImplementedHttpError_1 = require("../util/errors/NotImplementedHttpError");
/**
 * Base implementation of ResourceStore for implementers of custom stores.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
class BaseResourceStore {
    async resourceExists(identifier, conditions) {
        throw new NotImplementedHttpError_1.NotImplementedHttpError();
    }
    async getRepresentation(identifier, preferences, conditions) {
        throw new NotImplementedHttpError_1.NotImplementedHttpError();
    }
    async setRepresentation(identifier, representation, conditions) {
        throw new NotImplementedHttpError_1.NotImplementedHttpError();
    }
    async addResource(container, representation, conditions) {
        throw new NotImplementedHttpError_1.NotImplementedHttpError();
    }
    async deleteResource(identifier, conditions) {
        throw new NotImplementedHttpError_1.NotImplementedHttpError();
    }
    async modifyResource(identifier, patch, conditions) {
        throw new NotImplementedHttpError_1.NotImplementedHttpError();
    }
}
exports.BaseResourceStore = BaseResourceStore;
//# sourceMappingURL=BaseResourceStore.js.map