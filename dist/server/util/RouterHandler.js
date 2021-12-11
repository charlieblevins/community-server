"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterHandler = void 0;
const BadRequestHttpError_1 = require("../../util/errors/BadRequestHttpError");
const MethodNotAllowedHttpError_1 = require("../../util/errors/MethodNotAllowedHttpError");
const NotFoundHttpError_1 = require("../../util/errors/NotFoundHttpError");
const PathUtil_1 = require("../../util/PathUtil");
const HttpHandler_1 = require("../HttpHandler");
/**
 * An HttpHandler that checks if a given method and path are satisfied
 * and allows its handler to be executed if so.
 *
 * If `allowedMethods` contains '*' it will match all methods.
 */
class RouterHandler extends HttpHandler_1.HttpHandler {
    constructor(args) {
        super();
        this.baseUrl = PathUtil_1.ensureTrailingSlash(args.baseUrl);
        this.targetExtractor = args.targetExtractor;
        this.handler = args.handler;
        this.allowedMethods = args.allowedMethods;
        this.allMethods = args.allowedMethods.includes('*');
        this.allowedPathNamesRegEx = args.allowedPathNames.map((pn) => new RegExp(pn, 'u'));
    }
    async canHandle(input) {
        const { request } = input;
        if (!request.url) {
            throw new BadRequestHttpError_1.BadRequestHttpError('Cannot handle request without a url');
        }
        if (!request.method) {
            throw new BadRequestHttpError_1.BadRequestHttpError('Cannot handle request without a method');
        }
        if (!this.allMethods && !this.allowedMethods.includes(request.method)) {
            throw new MethodNotAllowedHttpError_1.MethodNotAllowedHttpError(`${request.method} is not allowed.`);
        }
        const pathName = await PathUtil_1.getRelativeUrl(this.baseUrl, request, this.targetExtractor);
        if (!this.allowedPathNamesRegEx.some((regex) => regex.test(pathName))) {
            throw new NotFoundHttpError_1.NotFoundHttpError(`Cannot handle route ${pathName}`);
        }
        await this.handler.canHandle(input);
    }
    async handle(input) {
        await this.handler.handle(input);
    }
}
exports.RouterHandler = RouterHandler;
//# sourceMappingURL=RouterHandler.js.map