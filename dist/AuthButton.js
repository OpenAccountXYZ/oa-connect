"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_2 = require("@nextui-org/react");
var AuthButton = function (_a) {
    var challenge = _a.challenge, onClick = _a.onClick;
    var openAuthWindow = function (challenge) {
        var base_url = 'https://account.test.oa.xyz';
        var callback_origin = window.location.origin;
        var url = "".concat(base_url, "?callback_origin=").concat(callback_origin, "&challenge=").concat(challenge);
        var windowWidth = 500;
        var windowHeight = 500;
        var windowLeft = (window.outerWidth / 2) + window.screenX - (windowWidth / 2);
        var windowTop = (window.outerHeight / 2) + window.screenY - (windowHeight / 2);
        var authWindow = window.open(url, 'AuthWindow', "width=".concat(windowWidth, ",height=").concat(windowHeight, ",left=").concat(windowLeft, ",top=").concat(windowTop));
        if (authWindow) {
            authWindow.focus();
        }
    };
    return (react_1.default.createElement(react_2.Button, { color: "primary", onClick: function () { openAuthWindow(challenge); if (onClick)
            onClick(); } }, "Open Auth Window"));
};
exports.default = AuthButton;
