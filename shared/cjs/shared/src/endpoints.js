"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.PASSWORD_SALT_ROUNDS = exports.MONGO_URL = exports.API_PORT = exports.API_ENDPOINT = exports.BACKOFFICE_ENDPOINT = exports.FRONTOFFICE_ENDPOINT = exports.GAME_ENDPOINT = void 0;
const endpoints_json_1 = __importDefault(require("../../endpoints.json"));
exports.GAME_ENDPOINT = endpoints_json_1.default.GAME_ENDPOINT;
exports.FRONTOFFICE_ENDPOINT = endpoints_json_1.default.FRONTOFFICE_ENDPOINT;
exports.BACKOFFICE_ENDPOINT = endpoints_json_1.default.BACKOFFICE_ENDPOINT;
exports.API_ENDPOINT = endpoints_json_1.default.API_ENDPOINT;
exports.API_PORT = endpoints_json_1.default.API_PORT;
exports.MONGO_URL = endpoints_json_1.default.MONGO_URL;
exports.PASSWORD_SALT_ROUNDS = endpoints_json_1.default.PASSWORD_SALT_ROUNDS;
exports.JWT_SECRET = endpoints_json_1.default.JWT_SECRET;
//# sourceMappingURL=endpoints.js.map