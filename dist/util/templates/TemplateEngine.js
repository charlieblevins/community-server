"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTemplate = exports.getTemplateFilePath = void 0;
const fs_1 = require("fs");
const PathUtil_1 = require("../PathUtil");
/* eslint-enable @typescript-eslint/method-signature-style */
/**
 * Returns the absolute path to the template.
 * Returns undefined if the input does not contain a file path.
 */
function getTemplateFilePath(template) {
    // The template has been passed as a filename
    if (typeof template === 'string') {
        return getTemplateFilePath({ templateFile: template });
    }
    // The template has already been given as a string so no known path
    if (!template || 'templateString' in template) {
        return;
    }
    const { templateFile, templatePath } = template;
    const fullTemplatePath = templatePath ? PathUtil_1.joinFilePath(templatePath, templateFile) : templateFile;
    return PathUtil_1.resolveAssetPath(fullTemplatePath);
}
exports.getTemplateFilePath = getTemplateFilePath;
/**
 * Reads the template and returns it as a string.
 */
async function readTemplate(template = { templateString: '' }) {
    // The template has already been given as a string
    if (typeof template === 'object' && 'templateString' in template) {
        return template.templateString;
    }
    // The template needs to be read from disk
    return fs_1.promises.readFile(getTemplateFilePath(template), 'utf8');
}
exports.readTemplate = readTemplate;
//# sourceMappingURL=TemplateEngine.js.map