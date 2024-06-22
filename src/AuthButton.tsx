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
    // <Button color="primary" onClick={() => { openAuthWindow(challenge); if (onClick) onClick(); }}>
    //   Open Auth Window
    // </Button>


    <div
      onClick={() => openAuthWindow(challenge)}
      className="flex cursor-pointer justify-center items-center px-3 py-2.5 text-center rounded-lg border border-solid border-zinc-300 md:w-[579px] max-md:px-5">
      <div className="flex gap-3">
        <div className="flex flex-col justify-center text-3xl font-medium leading-5 text-white whitespace-nowrap">
          <div className="justify-center items-center leading-[3.25rem] bg-black rounded-2xl h-[52px] w-[52px]">
            OP
          </div>
        </div>
        <div className="my-auto text-2xl leading-7 text-zinc-900">
          Sign in with OpenAccount
        </div>
      </div>
    </div>
  );
};

export default AuthButton;
