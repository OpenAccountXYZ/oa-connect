import React from 'react';
// import { Button } from '@nextui-org/react';
import '../dist/tailwind.css';

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
    <div
      onClick={() => openAuthWindow(challenge)}
      style={{
        width: ' 579px',
        borderRadius: '0.5rem',
      }}

      className="flex cursor-pointer justify-center items-center px-3 py-2.5 text-center rounded-lg border border-solid border-zinc-300 w-[579px] max-md:px-5">
      <div className="flex gap-3">
        <img
          loading="lazy"
          style={{
            width: '52px',
            height: '52px',
          }}
          src="https://account.test.oa.xyz/_next/image?url=%2Ficon.png&w=64&q=75"
          className="shrink-0 aspect-square w-[52px]"
        />
        <div className="my-auto">Sign in with OpenAccount</div>
      </div>
    </div>
  );
};

export default AuthButton;
