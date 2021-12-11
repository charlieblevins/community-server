"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationManager = void 0;
const assert_1 = __importDefault(require("assert"));
const LogUtil_1 = require("../../../../logging/LogUtil");
const PathUtil_1 = require("../../../../util/PathUtil");
const EmailPasswordUtil_1 = require("../EmailPasswordUtil");
const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/u;
/**
 * Supports IDP registration and pod creation based on input parameters.
 *
 * The above behaviour is combined in the two class functions.
 * `validateInput` will make sure all incoming data is correct and makes sense.
 * `register` will call all the correct handlers based on the requirements of the validated parameters.
 */
class RegistrationManager {
    constructor(args) {
        this.logger = LogUtil_1.getLoggerFor(this);
        this.baseUrl = args.baseUrl;
        this.webIdSuffix = args.webIdSuffix;
        this.identifierGenerator = args.identifierGenerator;
        this.ownershipValidator = args.ownershipValidator;
        this.accountStore = args.accountStore;
        this.podManager = args.podManager;
    }
    /**
     * Trims the input if it is a string, returns `undefined` otherwise.
     */
    trimString(input) {
        if (typeof input === 'string') {
            return input.trim();
        }
    }
    /**
     * Makes sure the input conforms to the following requirements when relevant:
     *  * At least one option needs to be chosen.
     *  * In case a new WebID needs to be created, the other 2 steps will be set to true.
     *  * Valid email/WebID/password/podName when required.
     *  * Only create a root pod when allowed.
     *
     * @param input - Input parameters for the registration procedure.
     * @param allowRoot - If creating a pod in the root container should be allowed.
     *
     * @returns A cleaned up version of the input parameters.
     * Only (trimmed) parameters that are relevant to the registration procedure will be retained.
     */
    validateInput(input, allowRoot = false) {
        const { email, password, confirmPassword, webId, podName, register, createPod, createWebId, template, rootPod, } = input;
        // Parse email
        const trimmedEmail = this.trimString(email);
        assert_1.default(trimmedEmail && emailRegex.test(trimmedEmail), 'Please enter a valid e-mail address.');
        EmailPasswordUtil_1.assertPassword(password, confirmPassword);
        const validated = {
            email: trimmedEmail,
            password,
            register: Boolean(register) || Boolean(createWebId),
            createPod: Boolean(createPod) || Boolean(createWebId),
            createWebId: Boolean(createWebId),
            rootPod: Boolean(rootPod),
        };
        assert_1.default(validated.register || validated.createPod, 'Please register for a WebID or create a Pod.');
        assert_1.default(allowRoot || !validated.rootPod, 'Creating a root pod is not supported.');
        // Parse WebID
        if (!validated.createWebId) {
            const trimmedWebId = this.trimString(webId);
            assert_1.default(trimmedWebId && /^https?:\/\/[^/]+/u.test(trimmedWebId), 'Please enter a valid WebID.');
            validated.webId = trimmedWebId;
        }
        // Parse Pod name
        if (validated.createPod && !validated.rootPod) {
            const trimmedPodName = this.trimString(podName);
            assert_1.default(trimmedPodName && trimmedPodName.length > 0, 'Please specify a Pod name.');
            validated.podName = trimmedPodName;
        }
        // Parse template if there is one
        if (template) {
            validated.template = this.trimString(template);
        }
        return validated;
    }
    /**
     * Handles the 3 potential steps of the registration process:
     *  1. Generating a new WebID.
     *  2. Registering a WebID with the IDP.
     *  3. Creating a new pod for a given WebID.
     *
     * All of these steps are optional and will be determined based on the input parameters.
     *
     * This includes the following steps:
     *  * Ownership will be verified when the WebID is provided.
     *  * When registering and creating a pod, the base URL will be used as oidcIssuer value.
     */
    async register(input, allowRoot = false) {
        // This is only used when createWebId and/or createPod are true
        let podBaseUrl;
        if (input.createPod) {
            if (input.rootPod) {
                podBaseUrl = { path: this.baseUrl };
            }
            else {
                podBaseUrl = this.identifierGenerator.generate(input.podName);
            }
        }
        // Create or verify the WebID
        if (input.createWebId) {
            input.webId = PathUtil_1.joinUrl(podBaseUrl.path, this.webIdSuffix);
        }
        else {
            await this.ownershipValidator.handleSafe({ webId: input.webId });
        }
        // Register the account
        const settings = {
            useIdp: input.register,
            podBaseUrl: podBaseUrl === null || podBaseUrl === void 0 ? void 0 : podBaseUrl.path,
        };
        await this.accountStore.create(input.email, input.webId, input.password, settings);
        // Create the pod
        if (input.createPod) {
            const podSettings = {
                email: input.email,
                webId: input.webId,
                template: input.template,
                podBaseUrl: podBaseUrl.path,
            };
            // Set the OIDC issuer to our server when registering with the IDP
            if (input.register) {
                podSettings.oidcIssuer = this.baseUrl;
            }
            try {
                // Only allow overwrite for root pods
                await this.podManager.createPod(podBaseUrl, podSettings, allowRoot);
            }
            catch (error) {
                await this.accountStore.deleteAccount(input.email);
                throw error;
            }
        }
        // Verify the account
        // This prevents there being a small timeframe where the account can be used before the pod creation is finished.
        // That timeframe could potentially be used by malicious users.
        await this.accountStore.verify(input.email);
        return {
            webId: input.webId,
            email: input.email,
            oidcIssuer: this.baseUrl,
            podBaseUrl: podBaseUrl === null || podBaseUrl === void 0 ? void 0 : podBaseUrl.path,
            createWebId: input.createWebId,
            register: input.register,
            createPod: input.createPod,
        };
    }
}
exports.RegistrationManager = RegistrationManager;
//# sourceMappingURL=RegistrationManager.js.map