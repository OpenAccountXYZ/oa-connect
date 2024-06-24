import React from 'react';
// import { Button } from '@nextui-org/react';
import './tailwind.css';

interface AuthButtonProps {
  challenge: string;
  onClick?: () => void; // 支持点击功能的回调函数
  default_url?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ challenge, onClick ,default_url}) => {

  const openAuthWindow = (challenge: string, default_url?: string) => {
    
    let base_url =  default_url ?? 'https://account.test.oa.xyz';
    let callback_origin = window.location.origin;
    let url = `${base_url}?callback_origin=${callback_origin}&challenge=${challenge}`;

    const windowWidth = 500;
    const windowHeight = 435;
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
      onClick={() => openAuthWindow(challenge, default_url)}
      style={{
        width: '300px',
        height: "50px",
        borderRadius: '0.5rem',
      }}

      className="flex cursor-pointer justify-center items-center px-3 py-2.5 text-center rounded-lg border border-solid border-zinc-300 max-md:px-5 hover:bg-gray-500 hover:duration-200 border-2">
      <div className="flex gap-3 items-center">
        <img
          loading="lazy"
          style={{
            width: '28px',
            height: '28px',
          }}
          src="https://account.test.oa.xyz/_next/image?url=%2Ficon.png&w=64&q=75"
          className="shrink-0 aspect-square "
        />
        <div className="my-auto" style={{
            fontSize: '18px'
          }}>Sign in with OpenAccount</div>
      </div>
    </div>
  );
};

export default AuthButton;
