import React from 'react';
export interface AuthButtonProps {
    challenge: string;
}
export declare const AuthButton: React.FC<AuthButtonProps>;
export declare function useAuthWindow(): {
    authResult: null;
    openAuthWindow: (url: string | URL | undefined, callback_origin: string, challenge: string) => void;
};
export interface OAChallenge {
    challenge: string;
    statement: string | null;
    requestID: number | null;
    expireTime: number | null;
}
export interface OAFullChallenge extends OAChallenge {
    version: string;
    origin: string;
    uri: string;
    account: string;
    chainID: number;
    issueTime: number;
    notBefore: number | null;
}
interface ICredential {
    id: string;
    publicKey: string;
    algorithm: string;
}
export declare function PasskeySign(credential: ICredential, challenge: OAFullChallenge): Promise<string>;
interface IOAResponse {
    fullChallenge: OAFullChallenge;
    signature: string;
}
export declare const uint8ArrayToHexString: (byteArray: Uint8Array) => string;
export declare function verifySignature(IOAResponse: IOAResponse): Promise<boolean>;
export {};
