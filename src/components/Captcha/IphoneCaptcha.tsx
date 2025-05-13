import React, { useCallback, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import request from '@/utils/request/request';

export interface IphoneCaptchaRef {
  getUuid: () => string;
}

const CaptchaControlled = forwardRef<IphoneCaptchaRef>((_, ref) => {
  const [code, setCode] = useState<string>();
  const [uuid, setUuid] = useState<string>('')

  useEffect(() => {
    getCaptchaCode()
  }, [])

  useImperativeHandle(ref, () => ({
    getUuid: () => uuid
  }));

  const handleClick = useCallback(async () => {
    await getCaptchaCode()
  }, []);

  /** 从后端获取验证码 */
  const getCaptchaCode = useCallback(async () => {
    const res = await request('/newApi/auth/captchaImage', {
      method: 'GET',
      skipAuth: true
    })
    setCode(res.data.img)
    setUuid(res.data.uuid)
  }, [])

  return (
    <span onClick={handleClick}>
      <img width={'80px'} height={'30px'} src={'data:image/jpeg;base64,' + code} alt="验证码" />
    </span>
  );
});

export default CaptchaControlled;