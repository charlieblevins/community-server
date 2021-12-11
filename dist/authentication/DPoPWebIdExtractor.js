"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DPoPWebIdExtractor = void 0;
const access_token_verifier_1 = require("@solid/access-token-verifier");
const LogUtil_1 = require("../logging/LogUtil");
const BadRequestHttpError_1 = require("../util/errors/BadRequestHttpError");
const NotImplementedHttpError_1 = require("../util/errors/NotImplementedHttpError");
const Credentials_1 = require("./Credentials");
const CredentialsExtractor_1 = require("./CredentialsExtractor");
/**
 * Credentials extractor that extracts a WebID from a DPoP-bound access token.
 */
class DPoPWebIdExtractor extends CredentialsExtractor_1.CredentialsExtractor {
    /**
     * @param originalUrlExtractor - Reconstructs the original URL as requested by the client
     */
    constructor(originalUrlExtractor) {
        super();
        this.verify = access_token_verifier_1.createSolidTokenVerifier();
        this.logger = LogUtil_1.getLoggerFor(this);
        this.originalUrlExtractor = originalUrlExtractor;
    }
    async canHandle({ headers }) {
        const { authorization } = headers;
        if (!authorization || !authorization.startsWith('DPoP ')) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('No DPoP-bound Authorization header specified.');
        }
    }
    async handle(request) {
        const { headers: { authorization, dpop }, method } = request;
        if (!dpop) {
            throw new BadRequestHttpError_1.BadRequestHttpError('No DPoP header specified.');
        }
        // Reconstruct the original URL as requested by the client,
        // since this is the one it used to authorize the request
        const originalUrl = await this.originalUrlExtractor.handleSafe({ request });
        // Validate the Authorization and DPoP header headers
        // and extract the WebID provided by the client
        try {
            const { webid: webId } = await this.verify(authorization, {
                header: dpop,
                method: method,
                url: originalUrl.path,
            });
            this.logger.info(`Verified WebID via DPoP-bound access token: ${webId}`);
            return { [Credentials_1.CredentialGroup.agent]: { webId } };
        }
        catch (error) {
            const message = `Error verifying WebID via DPoP-bound access token: ${error.message}`;
            this.logger.warn(message);
            throw new BadRequestHttpError_1.BadRequestHttpError(message, { cause: error });
        }
    }
}
exports.DPoPWebIdExtractor = DPoPWebIdExtractor;
//# sourceMappingURL=DPoPWebIdExtractor.js.map