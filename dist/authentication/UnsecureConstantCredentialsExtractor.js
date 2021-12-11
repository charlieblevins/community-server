"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsecureConstantCredentialsExtractor = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const Credentials_1 = require("./Credentials");
const CredentialsExtractor_1 = require("./CredentialsExtractor");
/**
 * Credentials extractor that authenticates a constant agent
 * (useful for development or debugging purposes).
 */
class UnsecureConstantCredentialsExtractor extends CredentialsExtractor_1.CredentialsExtractor {
    constructor(agent) {
        super();
        this.logger = LogUtil_1.getLoggerFor(this);
        this.credentials = { [Credentials_1.CredentialGroup.agent]: typeof agent === 'string' ? { webId: agent } : agent };
    }
    async handle() {
        this.logger.info(`Agent unsecurely claims to be ${this.credentials.agent.webId}`);
        return this.credentials;
    }
}
exports.UnsecureConstantCredentialsExtractor = UnsecureConstantCredentialsExtractor;
//# sourceMappingURL=UnsecureConstantCredentialsExtractor.js.map