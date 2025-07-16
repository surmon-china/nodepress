"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgv = void 0;
exports.parseArgs = parseArgs;
const isNil_1 = __importDefault(require("lodash/isNil"));
const isUndefined_1 = __importDefault(require("lodash/isUndefined"));
const yargs_parser_1 = __importDefault(require("yargs-parser"));
const parseArgv = (argv) => (0, yargs_parser_1.default)(argv);
exports.parseArgv = parseArgv;
function parseArgs(parsedArgs) {
    function get(input, defaultValue) {
        if ((0, isNil_1.default)(input)) {
            throw new Error('Argument options must be a string or an object with key and default properties.');
        }
        if (typeof input === 'string') {
            const value = parsedArgs[input];
            return (0, isUndefined_1.default)(value) ? defaultValue : value;
        }
        const key = input.key;
        const value = parsedArgs[key];
        if (input.required && (0, isNil_1.default)(value)) {
            throw new Error(input.message || `Missing required argument: "${key}". Please pass it using --${key}=<value>`);
        }
        if ((0, isUndefined_1.default)(value)) {
            return input.default;
        }
        return value;
    }
    return get;
}
//# sourceMappingURL=args.js.map