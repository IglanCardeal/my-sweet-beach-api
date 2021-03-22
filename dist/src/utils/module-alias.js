"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const module_alias_1 = __importDefault(require("module-alias"));
const files = path_1.default.resolve(__dirname, '../..');
module_alias_1.default.addAliases({
    '@src': path_1.default.join(files, 'src'),
    '@test': path_1.default.join(files, 'test'),
});
//# sourceMappingURL=module-alias.js.map