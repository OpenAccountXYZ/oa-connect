"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
// import { Button } from '@nextui-org/react';
require("../dist/tailwind.css");
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
    return (
    // <Button color="primary" onClick={() => { openAuthWindow(challenge); if (onClick) onClick(); }}>
    //   Open Auth Window
    // </Button>
    react_1.default.createElement("div", { onClick: function () { return openAuthWindow(challenge); }, className: "flex cursor-pointer justify-center items-center px-3 py-2.5 text-center rounded-lg border border-solid border-zinc-300 md:w-[579px] max-md:px-5" },
        react_1.default.createElement("div", { className: "flex gap-3" },
            react_1.default.createElement("div", { className: "flex flex-col justify-center text-3xl font-medium leading-5 text-white whitespace-nowrap" },
                react_1.default.createElement("div", { className: "justify-center items-center leading-[3.25rem] bg-black rounded-2xl h-[52px] w-[52px]" }, "OP")),
            react_1.default.createElement("div", { className: "my-auto text-2xl leading-7 text-zinc-900" }, "Sign in with OpenAccount"))));
};
exports.default = AuthButton;
