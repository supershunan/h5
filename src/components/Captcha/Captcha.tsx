import React, { useCallback, useState, forwardRef, useImperativeHandle } from "react";
import Captcha from "react-captcha-code";
import { randomNum, originalCharacter } from "./utils";

interface Props {
  clearPwCode: () => void
}

export interface CaptchaRef {
  getCode: () => string;
}

// 生成随机验证码的函数
const generateRandomCode = () => {
  let str = "";
  for (let i = 0; i < 4; i++) {
    const temp = originalCharacter[randomNum(0, originalCharacter.length - 1)];
    str = `${str}${temp}`;
  }
  return str;
};

const CaptchaControlled = forwardRef<CaptchaRef, Props>((props, ref) => {
  const [code, setCode] = useState(generateRandomCode()); // 使用随机生成的初始值

  useImperativeHandle(ref, () => ({
    getCode: () => code
  }));

  const handleClick = useCallback(() => {
    setCode(generateRandomCode());
    props.clearPwCode()
  }, []);

  return (
    <span>
      <Captcha onClick={handleClick} code={code} />
    </span>
  );
});

export default CaptchaControlled;