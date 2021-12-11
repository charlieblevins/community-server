"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGeneratedResources = void 0;
/**
 * Generates resources with the given generator and adds them to the given store.
 * @param identifier - Identifier of the pod.
 * @param settings - Settings from which the pod is being created.
 * @param generator - Generator to be used.
 * @param store - Store to be updated.
 *
 * @returns The amount of resources that were added.
 */
async function addGeneratedResources(identifier, settings, generator, store) {
    const resources = generator.generate(identifier, settings);
    let count = 0;
    for await (const { identifier: resourceId, representation } of resources) {
        await store.setRepresentation(resourceId, representation);
        count += 1;
    }
    return count;
}
exports.addGeneratedResources = addGeneratedResources;
//# sourceMappingURL=GenerateUtil.js.map