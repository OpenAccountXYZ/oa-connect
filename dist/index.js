"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthWindow = exports.verifySignature = exports.AuthButton = void 0;
var useAuthWindow_1 = require("./useAuthWindow");
Object.defineProperty(exports, "verifySignature", { enumerable: true, get: function () { return useAuthWindow_1.verifySignature; } });
Object.defineProperty(exports, "useAuthWindow", { enumerable: true, get: function () { return useAuthWindow_1.useAuthWindow; } });
var AuthButton_1 = __importDefault(require("./AuthButton"));
exports.AuthButton = AuthButton_1.default;
