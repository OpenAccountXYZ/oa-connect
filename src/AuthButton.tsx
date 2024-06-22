import React from 'react';
import { Button } from '@nextui-org/react';

interface AuthButtonProps {
  challenge: string;
  onClick?: () => void; // 支持点击功能的回调函数
}

const AuthButton: React.FC<AuthButtonProps> = ({ challenge, onClick }) => {

  const openAuthWindow = (challenge: string) => {
    let base_url = 'https://account.test.oa.xyz';
    let callback_origin = window.location.origin;
    let url = `${base_url}?callback_origin=${callback_origin}&challenge=${challenge}`;

    const windowWidth = 500;
    const windowHeight = 500;
    const windowLeft = (window.outerWidth / 2) + window.screenX - (windowWidth / 2);
    const windowTop = (window.outerHeight / 2) + window.screenY - (windowHeight / 2);

    const authWindow = window.open(
      url,
      'AuthWindow',
      `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop}`
    );

    if (authWindow) {
      authWindow.focus();
    }
  };

  return (
    <Button color="primary" onClick={() => { openAuthWindow(challenge); if (onClick) onClick(); }}>
      Open Auth Window
    </Button>
  );
};

export default AuthButton;
