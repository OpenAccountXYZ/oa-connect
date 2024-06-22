"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uint8ArrayToHexString = exports.AuthButton = void 0;
exports.useAuthWindow = useAuthWindow;
exports.PasskeySign = PasskeySign;
exports.verifySignature = verifySignature;
var react_1 = require("react");
var webauthn_1 = require("@passwordless-id/webauthn");
var asn1_ecc_1 = require("@peculiar/asn1-ecc");
var asn1_schema_1 = require("@peculiar/asn1-schema");
var sdk_1 = require("@soulwallet/sdk");
var ethers_1 = require("ethers");
var react_2 = require("@nextui-org/react");
var react_3 = __importDefault(require("react"));
var AuthButton = function (_a) {
    var challenge = _a.challenge;
    var openAuthWindow = function (challenge) {
        var base_url = 'https://account.test.oa.xyz';
        var callback_origin = window.location.origin;
        var url = base_url + '?callback_origin=' + callback_origin + "&challenge=" + challenge;
        var windowWidth = 500;
        var windowHeight = 500;
        var windowLeft = (window.outerWidth / 2) + window.screenX - (windowWidth / 2);
        var windowTop = (window.outerHeight / 2) + window.screenY - (windowHeight / 2);
        var authWindow = window.open(url, 'AuthWindow', "width=".concat(windowWidth, ",height=").concat(windowHeight, ",left=").concat(windowLeft, ",top=").concat(windowTop));
        if (authWindow) {
            authWindow.focus();
        }
    };
    return (react_3.default.createElement(react_2.Button, { color: "primary", onClick: function () { return openAuthWindow(challenge); } }, "Open Auth Window"));
};
exports.AuthButton = AuthButton;
function useAuthWindow() {
    var _a = (0, react_1.useState)(null), authResult = _a[0], setAuthResult = _a[1];
    (0, react_1.useEffect)(function () {
        var handleMessage = function (event) {
            if (event.data.type === 'AUTH_RESULT') {
                setAuthResult(event.data.payload);
            }
        };
        window.addEventListener('message', handleMessage);
        return function () {
            window.removeEventListener('message', handleMessage);
        };
    }, []);
    var openAuthWindow = function (url, callback_origin, challenge) {
        if (!url) {
            url = window.location.origin;
        }
        url = url + '?callback_origin=' + callback_origin + "&challenge=" + challenge;
        var windowWidth = 500;
        var windowHeight = 500;
        var windowLeft = (window.outerWidth / 2) + window.screenX - (windowWidth / 2);
        var windowTop = (window.outerHeight / 2) + window.screenY - (windowHeight / 2);
        var authWindow = window.open(url, 'AuthWindow', "width=".concat(windowWidth, ",height=").concat(windowHeight, ",left=").concat(windowLeft, ",top=").concat(windowTop));
        if (authWindow) {
            authWindow.focus();
        }
    };
    return { authResult: authResult, openAuthWindow: openAuthWindow, };
}
;
;
function OAFullChallengeToString(challenge) {
    return "".concat(challenge.origin, " wants you to sign in with your Ethereum account:\n").concat(challenge.account, "\n\n").concat(challenge.statement, "\n\nVersion: ").concat(challenge.version, "\nURI: ").concat(challenge.uri, "\nChallenge: ").concat(challenge.challenge, "\nRequest ID: ").concat(challenge.requestID, "\nChain ID: ").concat(challenge.chainID, "\nIssue Time: ").concat(challenge.issueTime, "\nNot Before: ").concat(challenge.notBefore, "\nExpire Time: ").concat(challenge.expireTime, "\n");
}
var RPC_URL = "https://sepolia.optimism.io";
var BUNDLER_URL = "https://api.pimlico.io/v2/optimism-sepolia/rpc?apikey=da8c37e8-9ccc-4928-ab88-615b7de5c088";
var soulWalletFactory = "0xF78Ae187CED0Ca5Fb98100d3F0EAB7a6461d6fC6";
var defaultCallbackHandler = "0x880c6eb80583795625935B08AA28EB37F16732C7";
var socialRecoveryModule = "0x3Cc36538cf53A13AF5C28BB693091e23CF5BB567";
var SoulWalletDefaultValidator = "0x82621ac52648b738fEdd381a3678851933505762";
var soulWallet = new sdk_1.SoulWallet(RPC_URL, BUNDLER_URL, soulWalletFactory, defaultCallbackHandler, socialRecoveryModule);
function HashOAFullChallenge(challenge) {
    return __awaiter(this, void 0, void 0, function () {
        var message, hash, packed1271HashRet, typedMessage, packedHashRet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    message = OAFullChallengeToString(challenge);
                    hash = (0, ethers_1.hashMessage)(message);
                    return [4 /*yield*/, soulWallet.getEIP1271TypedData(challenge.account, hash)];
                case 1:
                    packed1271HashRet = _a.sent();
                    if (packed1271HashRet.isErr()) {
                        throw new Error(packed1271HashRet.ERR.message);
                    }
                    typedMessage = packed1271HashRet.OK.typedMessage;
                    return [4 /*yield*/, soulWallet.packRawHash(typedMessage)];
                case 2:
                    packedHashRet = _a.sent();
                    if (packedHashRet.isErr()) {
                        throw new Error(packedHashRet.ERR.message);
                    }
                    return [2 /*return*/, packedHashRet.OK];
            }
        });
    });
}
// 2. sign the packed hash with the credential
function PasskeySign(credential, challenge) {
    return __awaiter(this, void 0, void 0, function () {
        var packedHash, signatureData, packedSignatureRet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HashOAFullChallenge(challenge)];
                case 1:
                    packedHash = _a.sent();
                    return [4 /*yield*/, signByPasskey(credential, packedHash.packedHash)];
                case 2:
                    signatureData = _a.sent();
                    return [4 /*yield*/, soulWallet.packUserOpP256Signature(SoulWalletDefaultValidator, signatureData, packedHash.validationData)];
                case 3:
                    packedSignatureRet = _a.sent();
                    if (packedSignatureRet.isErr()) {
                        throw new Error(packedSignatureRet.ERR.message);
                    }
                    return [2 /*return*/, packedSignatureRet.OK];
            }
        });
    });
}
var uint8ArrayToHexString = function (byteArray) {
    return Array.from(byteArray)
        .map(function (byte) { return byte.toString(16).padStart(2, '0'); })
        .join('');
};
exports.uint8ArrayToHexString = uint8ArrayToHexString;
var decodeDER = function (signatureBase64) {
    var derSignature = Buffer.from(signatureBase64, 'base64'); // base64ToBuffer(signature);
    var parsedSignature = asn1_schema_1.AsnParser.parse(derSignature, asn1_ecc_1.ECDSASigValue);
    var rBytes = new Uint8Array(parsedSignature.r);
    var sBytes = new Uint8Array(parsedSignature.s);
    if (rBytes.length === 33 && rBytes[0] === 0) {
        rBytes = rBytes.slice(1);
    }
    if (sBytes.length === 33 && sBytes[0] === 0) {
        sBytes = sBytes.slice(1);
    }
    var r = "0x".concat((0, exports.uint8ArrayToHexString)(rBytes).padStart(64, '0'));
    var s = "0x".concat((0, exports.uint8ArrayToHexString)(sBytes).padStart(64, '0'));
    return {
        r: r,
        s: s,
    };
};
var base64urlTobase64 = function (base64url) {
    var paddedUrl = base64url.padEnd(base64url.length + ((4 - (base64url.length % 4)) % 4), '=');
    return paddedUrl.replace(/\-/g, '+').replace(/_/g, '/');
};
var base64Tobase64url = function (base64) {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};
var base64ToBigInt = function (base64String) {
    var binaryString = atob(base64String);
    var result = BigInt(0);
    for (var i = 0; i < binaryString.length; i++) {
        result = (result << BigInt(8)) | BigInt(binaryString.charCodeAt(i));
    }
    return result;
};
var signByPasskey = function (credential, hash) { return __awaiter(void 0, void 0, void 0, function () {
    var challenge, authentication, authenticatorData, clientData, sliceIndex, clientDataSuffix, signatureBase64, _a, r, s;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                challenge = sdk_1.Base64Url.bytes32Tobase64Url(hash);
                return [4 /*yield*/, webauthn_1.client.authenticate([credential.id], challenge)];
            case 1:
                authentication = _b.sent();
                authenticatorData = "0x".concat(base64ToBigInt(base64urlTobase64(authentication.authenticatorData)).toString(16));
                clientData = atob(base64urlTobase64(authentication.clientData));
                sliceIndex = clientData.indexOf("\",\"origin\"");
                clientDataSuffix = clientData.slice(sliceIndex);
                signatureBase64 = base64urlTobase64(authentication.signature);
                _a = decodeDER(signatureBase64), r = _a.r, s = _a.s;
                return [2 /*return*/, {
                        messageHash: hash,
                        publicKey: credential.publicKey,
                        r: r,
                        s: s,
                        authenticatorData: authenticatorData,
                        clientDataSuffix: clientDataSuffix,
                    }];
        }
    });
}); };
// 4. app verify the signature
function verifySignature(IOAResponse) {
    return __awaiter(this, void 0, void 0, function () {
        var provider, hash;
        return __generator(this, function (_a) {
            provider = new ethers_1.JsonRpcProvider(RPC_URL);
            hash = (0, ethers_1.hashMessage)(OAFullChallengeToString(IOAResponse.fullChallenge));
            return [2 /*return*/, verify1271(provider, IOAResponse.fullChallenge.account, hash, IOAResponse.signature)];
        });
    });
}
var magicValue = '0x1626ba7e';
var eip1271Abi = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "_messageHash",
                "type": "bytes32"
            },
            {
                "name": "_signature",
                "type": "bytes"
            }
        ],
        "name": "isValidSignature",
        "outputs": [
            {
                "name": "magicValue",
                "type": "bytes4"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];
function verify1271(provider, signerAddress, hash, signature) {
    return __awaiter(this, void 0, void 0, function () {
        var bytecode, contract, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, provider.getCode(signerAddress)];
                case 1:
                    bytecode = _a.sent();
                    if (!bytecode || bytecode === '0x' ||
                        bytecode === '0x0' || bytecode === '0x00') {
                        return [2 /*return*/, false];
                    }
                    contract = new ethers_1.Contract(signerAddress, eip1271Abi, provider);
                    return [4 /*yield*/, contract.isValidSignature(hash, signature)];
                case 2:
                    result = _a.sent();
                    console.log("".concat(result));
                    return [2 /*return*/, result.toLowerCase() === magicValue];
            }
        });
    });
}
