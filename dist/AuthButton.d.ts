import React from 'react';
import '../dist/tailwind.css';
interface AuthButtonProps {
    challenge: string;
    onClick?: () => void;
}
declare const AuthButton: React.FC<AuthButtonProps>;
export default AuthButton;
