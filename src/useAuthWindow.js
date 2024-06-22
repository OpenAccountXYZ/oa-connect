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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uint8ArrayToHexString = void 0;
exports.useAuthWindow = useAuthWindow;
exports.PasskeySign = PasskeySign;
exports.verifySignature = verifySignature;
const react_1 = require("react");
const webauthn_1 = require("@passwordless-id/webauthn");
const asn1_ecc_1 = require("@peculiar/asn1-ecc");
const asn1_schema_1 = require("@peculiar/asn1-schema");
const sdk_1 = require("@soulwallet/sdk");
const ethers_1 = require("ethers");
const react_2 = require("@nextui-org/react");
const react_3 = __importDefault(require("react"));
const AuthButton = ({ challenge }) => {
    const openAuthWindow = (challenge) => {
        let base_url = 'https://account.test.oa.xyz';
        let callback_origin = window.location.origin;
        let url = base_url + '?callback_origin=' + callback_origin + "&challenge=" + challenge;
        const windowWidth = 500;
        const windowHeight = 500;
        const windowLeft = (window.outerWidth / 2) + window.screenX - (windowWidth / 2);
        const windowTop = (window.outerHeight / 2) + window.screenY - (windowHeight / 2);
        const authWindow = window.open(url, 'AuthWindow', `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop}`);
        if (authWindow) {
            authWindow.focus();
        }
    };
    return (react_3.default.createElement(react_2.Button, { color: "primary", onClick: () => openAuthWindow(challenge) }, "Open Auth Window"));
};
function useAuthWindow() {
    const [authResult, setAuthResult] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const handleMessage = (event) => {
            if (event.data.type === 'AUTH_RESULT') {
                setAuthResult(event.data.payload);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);
    const openAuthWindow = (url, callback_origin, challenge) => {
        if (!url) {
            url = window.location.origin;
        }
        url = url + '?callback_origin=' + callback_origin + "&challenge=" + challenge;
        const windowWidth = 500;
        const windowHeight = 500;
        const windowLeft = (window.outerWidth / 2) + window.screenX - (windowWidth / 2);
        const windowTop = (window.outerHeight / 2) + window.screenY - (windowHeight / 2);
        const authWindow = window.open(url, 'AuthWindow', `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop}`);
        if (authWindow) {
            authWindow.focus();
        }
    };
    return { authResult, openAuthWindow, };
}
;
;
function OAFullChallengeToString(challenge) {
    return `${challenge.origin} wants you to sign in with your Ethereum account:
${challenge.account}

${challenge.statement}

Version: ${challenge.version}
URI: ${challenge.uri}
Challenge: ${challenge.challenge}
Request ID: ${challenge.requestID}
Chain ID: ${challenge.chainID}
Issue Time: ${challenge.issueTime}
Not Before: ${challenge.notBefore}
Expire Time: ${challenge.expireTime}
`;
}
const RPC_URL = "https://sepolia.optimism.io";
const BUNDLER_URL = "https://api.pimlico.io/v2/optimism-sepolia/rpc?apikey=da8c37e8-9ccc-4928-ab88-615b7de5c088";
const soulWalletFactory = "0xF78Ae187CED0Ca5Fb98100d3F0EAB7a6461d6fC6";
const defaultCallbackHandler = "0x880c6eb80583795625935B08AA28EB37F16732C7";
const socialRecoveryModule = "0x3Cc36538cf53A13AF5C28BB693091e23CF5BB567";
const SoulWalletDefaultValidator = "0x82621ac52648b738fEdd381a3678851933505762";
const soulWallet = new sdk_1.SoulWallet(RPC_URL, BUNDLER_URL, soulWalletFactory, defaultCallbackHandler, socialRecoveryModule);
function HashOAFullChallenge(challenge) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = OAFullChallengeToString(challenge);
        const hash = (0, ethers_1.hashMessage)(message);
        const packed1271HashRet = yield soulWallet.getEIP1271TypedData(challenge.account, hash);
        if (packed1271HashRet.isErr()) {
            throw new Error(packed1271HashRet.ERR.message);
        }
        const typedMessage = packed1271HashRet.OK.typedMessage;
        const packedHashRet = yield soulWallet.packRawHash(typedMessage);
        if (packedHashRet.isErr()) {
            throw new Error(packedHashRet.ERR.message);
        }
        return packedHashRet.OK;
    });
}
// 2. sign the packed hash with the credential
function PasskeySign(credential, challenge) {
    return __awaiter(this, void 0, void 0, function* () {
        const packedHash = yield HashOAFullChallenge(challenge);
        const signatureData = yield signByPasskey(credential, packedHash.packedHash);
        const packedSignatureRet = yield soulWallet.packUserOpP256Signature(SoulWalletDefaultValidator, signatureData, packedHash.validationData);
        if (packedSignatureRet.isErr()) {
            throw new Error(packedSignatureRet.ERR.message);
        }
        return packedSignatureRet.OK;
    });
}
const uint8ArrayToHexString = (byteArray) => {
    return Array.from(byteArray)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
};
exports.uint8ArrayToHexString = uint8ArrayToHexString;
const decodeDER = (signatureBase64) => {
    const derSignature = Buffer.from(signatureBase64, 'base64'); // base64ToBuffer(signature);
    const parsedSignature = asn1_schema_1.AsnParser.parse(derSignature, asn1_ecc_1.ECDSASigValue);
    let rBytes = new Uint8Array(parsedSignature.r);
    let sBytes = new Uint8Array(parsedSignature.s);
    if (rBytes.length === 33 && rBytes[0] === 0) {
        rBytes = rBytes.slice(1);
    }
    if (sBytes.length === 33 && sBytes[0] === 0) {
        sBytes = sBytes.slice(1);
    }
    const r = `0x${(0, exports.uint8ArrayToHexString)(rBytes).padStart(64, '0')}`;
    const s = `0x${(0, exports.uint8ArrayToHexString)(sBytes).padStart(64, '0')}`;
    return {
        r,
        s,
    };
};
const base64urlTobase64 = (base64url) => {
    const paddedUrl = base64url.padEnd(base64url.length + ((4 - (base64url.length % 4)) % 4), '=');
    return paddedUrl.replace(/\-/g, '+').replace(/_/g, '/');
};
const base64Tobase64url = (base64) => {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};
const base64ToBigInt = (base64String) => {
    const binaryString = atob(base64String);
    let result = BigInt(0);
    for (let i = 0; i < binaryString.length; i++) {
        result = (result << BigInt(8)) | BigInt(binaryString.charCodeAt(i));
    }
    return result;
};
const signByPasskey = (credential, hash) => __awaiter(void 0, void 0, void 0, function* () {
    const challenge = sdk_1.Base64Url.bytes32Tobase64Url(hash);
    let authentication = yield webauthn_1.client.authenticate([credential.id], challenge);
    const authenticatorData = `0x${base64ToBigInt(base64urlTobase64(authentication.authenticatorData)).toString(16)}`;
    const clientData = atob(base64urlTobase64(authentication.clientData));
    const sliceIndex = clientData.indexOf(`","origin"`);
    const clientDataSuffix = clientData.slice(sliceIndex);
    const signatureBase64 = base64urlTobase64(authentication.signature);
    const { r, s } = decodeDER(signatureBase64);
    return {
        messageHash: hash,
        publicKey: credential.publicKey,
        r,
        s,
        authenticatorData,
        clientDataSuffix,
    };
});
// 4. app verify the signature
function verifySignature(IOAResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = new ethers_1.JsonRpcProvider(RPC_URL);
        const hash = (0, ethers_1.hashMessage)(OAFullChallengeToString(IOAResponse.fullChallenge));
        return verify1271(provider, IOAResponse.fullChallenge.account, hash, IOAResponse.signature);
    });
}
const magicValue = '0x1626ba7e';
const eip1271Abi = [
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
    return __awaiter(this, void 0, void 0, function* () {
        const bytecode = yield provider.getCode(signerAddress);
        if (!bytecode || bytecode === '0x' ||
            bytecode === '0x0' || bytecode === '0x00') {
            return false;
        }
        const contract = new ethers_1.Contract(signerAddress, eip1271Abi, provider);
        const result = yield contract.isValidSignature(hash, signature);
        console.log(`${result}`);
        return result.toLowerCase() === magicValue;
    });
}
