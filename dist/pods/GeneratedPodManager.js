"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratedPodManager = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const ConflictHttpError_1 = require("../util/errors/ConflictHttpError");
const GenerateUtil_1 = require("./generate/GenerateUtil");
/**
 * Pod manager that uses an {@link IdentifierGenerator} and {@link ResourcesGenerator}
 * to create the default resources and identifier for a new pod.
 */
class GeneratedPodManager {
    constructor(store, resourcesGenerator) {
        this.logger = LogUtil_1.getLoggerFor(this);
        this.store = store;
        this.resourcesGenerator = resourcesGenerator;
    }
    /**
     * Creates a new pod, pre-populating it with the resources created by the data generator.
     * Will throw an error if the given identifier already has a resource.
     */
    async createPod(identifier, settings, overwrite) {
        this.logger.info(`Creating pod ${identifier.path}`);
        if (!overwrite && await this.store.resourceExists(identifier)) {
            throw new ConflictHttpError_1.ConflictHttpError(`There already is a resource at ${identifier.path}`);
        }
        const count = await GenerateUtil_1.addGeneratedResources(identifier, settings, this.resourcesGenerator, this.store);
        this.logger.info(`Added ${count} resources to ${identifier.path}`);
    }
}
exports.GeneratedPodManager = GeneratedPodManager;
//# sourceMappingURL=GeneratedPodManager.js.map