"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootFilePathHandler = void 0;
const fs_1 = require("fs");
const ConflictHttpError_1 = require("../../../util/errors/ConflictHttpError");
const SystemError_1 = require("../../../util/errors/SystemError");
const VariableHandler_1 = require("./VariableHandler");
const Variables_1 = require("./Variables");
/**
 * Uses a FileIdentifierMapper to generate a root file path variable based on the identifier.
 * Will throw an error if the resulting file path already exists.
 */
class RootFilePathHandler extends VariableHandler_1.VariableHandler {
    constructor(fileMapper) {
        super();
        this.fileMapper = fileMapper;
    }
    async handle({ identifier, settings }) {
        const path = (await this.fileMapper.mapUrlToFilePath(identifier, false)).filePath;
        try {
            // Even though we check if it already exists, there is still a potential race condition
            // in between this check and the store being created.
            await fs_1.promises.access(path);
            throw new ConflictHttpError_1.ConflictHttpError(`There already is a folder that corresponds to ${identifier.path}`);
        }
        catch (error) {
            if (!(SystemError_1.isSystemError(error) && error.code === 'ENOENT')) {
                throw error;
            }
            settings[Variables_1.TEMPLATE_VARIABLE.rootFilePath] = path;
        }
    }
}
exports.RootFilePathHandler = RootFilePathHandler;
//# sourceMappingURL=RootFilePathHandler.js.map