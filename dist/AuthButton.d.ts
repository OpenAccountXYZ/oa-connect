import React from 'react';
interface AuthButtonProps {
    challenge: string;
    onClick?: () => void;
}
declare const AuthButton: React.FC<AuthButtonProps>;
export default AuthButton;
