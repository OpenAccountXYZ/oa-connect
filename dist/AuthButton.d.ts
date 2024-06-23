import React from 'react';
import './tailwind.css';
interface AuthButtonProps {
    challenge: string;
    onClick?: () => void;
    default_url?: string;
}
declare const AuthButton: React.FC<AuthButtonProps>;
export default AuthButton;
