import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'umi';
import { Form, Input, Divider, Button, Toast, Image } from 'antd-mobile';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { StatusEnum, PhoneLogin, Registor, PwLogin, LoginTypeEnum } from './index.type';
import LoginBgCZZ from './../../assets/images/创作者中心.png';
import LoginBgDR from './../../assets/images/达人中心.png';
import './index.less';
import '@/pages/global.less';
import request from '@/utils/request/request';
import { RequstStatusEnum } from '@/utils/request/request.type';
import { md5 } from 'js-md5';
import Captcha, { CaptchaRef } from '@/components/Captcha/Captcha';

const COUNT_TIME = 60 * 5;
export default function Login() {
    const { search } = useLocation();
    const urlParams = new URLSearchParams(search);
    const id = urlParams.get("id");
    const [currentStatus, setCurrentStatus] = useState(StatusEnum.pwLogin);
    const statusText = useRef([
        {
            key: StatusEnum.register,
            name: '注册账号'
        },
        {
            key: StatusEnum.phoneLogin,
            name: '手机登录'
        },
        {
            key: StatusEnum.pwLogin,
            name: '密码登录'
        },
    ]);
    const [visible, setVisible] = useState(false)
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [countTime, setCountTime] = useState<number>(COUNT_TIME);
    const [showTime, setShowTime] = useState(false);
    const timeInterval = useRef(-1);
    const currenHost = useRef(location.host);
    const captchaRef = useRef<CaptchaRef>(null);
    const [pwErrorNum, setPwErrorNum] = useState(0)


    const register = async (values: any): Promise<boolean> => {
        const data = {
            account: values.account,
            password: md5(values.password), //密码md5加密
            smsCode: values.smsCode,//短信验证码
            // pid: null //推荐人id，如果推荐人不为空，则要传到后台，如果推荐人不是团长会返回请求非法
        };
        const res = await request('/newApi/auth/regForH5', {
            method: 'POST',
            skipAuth: true,
            body: data
        });
        return res.code === RequstStatusEnum.success;
    }

    const sendSms = async (mobile: number) => {
        const data = {
            mobile
        }
        const res = await request('/newApi/auth/sendSms', {
            method: 'POST',
            skipAuth: true,
            body: data
        })
        Toast.show(res.msg)
    }

    const pwLogin = async (values: any): Promise<boolean> => {
        const data = {
            account: values.account,
            password: md5(values.password)
        }
        const res = await request(`/newApi//auth/loginForH5/${LoginTypeEnum.pwLogin}`, {
            method: 'POST',
            skipAuth: true,
            body: data
        })
        if (res.code === RequstStatusEnum.success) {
            localStorage.setItem('Token', res.data.token);
        }
        return res.code === RequstStatusEnum.success;
    }

    const phoneLogin = async (values: any): Promise<boolean> => {
        const data = {
            account: values.account,
            code: values.smsCode
        }
        const res = await request(`/newApi//auth/loginForH5/${LoginTypeEnum.phoneLogin}`, {
            method: 'POST',
            skipAuth: true,
            body: data
        })
        if (res.code === RequstStatusEnum.success) {
            localStorage.setItem('Token', res.data.token);
        }
        return res.code === RequstStatusEnum.success;
    }

    const sendCode = async () => {
        const values: PhoneLogin | Registor | PwLogin = form.getFieldsValue(); 4
        if (!values.account) {
            Toast.show('请输入手机号');
            return;
        }
        if (countTime < COUNT_TIME) {
            Toast.show('禁止频繁获取验证码')
            return;
        }
        await sendSms(values?.account as number);
        setShowTime(true);
        const baseTime = countTime;
        let count = 1;
        timeInterval.current = setInterval(() => {
            const time = baseTime - count;
            if (time === -1) {
                // 需要清除上一次的倒计时
                clearInterval(timeInterval.current);
            } else {
                if (time === 0) {
                    setCountTime(COUNT_TIME);
                    setShowTime(false);
                } else {
                    setCountTime(time);
                }
            }
            count++;
        }, 1000);
    }

    const handleGo = (key: number) => {
        setCurrentStatus(key);
    }

    const handleLoginOrRegidter = async () => {
        let status;
        const values: PhoneLogin | Registor | PwLogin = form.getFieldsValue();
        if (currentStatus === StatusEnum.register) {
            if (id) {
                values.pid = id;
            }
            status = await register(values);
            if (status) {
                Toast.show({
                    icon: 'success',
                    content: '注册成功',
                });
                form.resetFields();
            } else {
                Toast.show({
                    icon: 'fail',
                    content: '注册失败',
                });
                return;
            }
            setCurrentStatus(StatusEnum.phoneLogin);
        } else if (currentStatus === StatusEnum.pwLogin) {
            status = await pwLogin(values);
            if (status) {
                Toast.show({
                    icon: 'success',
                    content: '登录成功',
                });
                form.resetFields();
            } else {
                setPwErrorNum((value) => {
                    return value + 1
                })
                Toast.show({
                    icon: 'fail',
                    content: '登录失败',
                });
                return
            }
        } else if (currentStatus === StatusEnum.phoneLogin) {
            status = await phoneLogin(values);
            if (status) {
                Toast.show({
                    icon: 'success',
                    content: '登录成功',
                });
                form.resetFields();
            } else {
                Toast.show({
                    icon: 'fail',
                    content: '登录失败',
                });
                return
            }
        }
        navigate('/');
    }

    const clearPwCode = () => {
        form.setFieldValue('pwCode', "")
    }

    const currentBtn = useMemo(() => {
        if (currentStatus === StatusEnum.register) {
            return (
                <div className='btn'>
                    <Button onClick={handleLoginOrRegidter} style={{ padding: '11px 117px', background: '#F99025', borderColor: '#F99025' }} color='primary' shape='rounded'>立即注册</Button>
                </div>
            );
        }
        return (
            <div className='btn'>
                <Button onClick={handleLoginOrRegidter} style={{ padding: '11px 117px', background: '#F99025', borderColor: '#F99025' }} color='primary' shape='rounded'>立即登录</Button>
            </div>
        );
    }, [currentStatus])

    return (
        <div className='login'>
            <div className="login-content">
                <img src={currenHost.current === 'dr.qfydkj.cn' ? LoginBgDR : LoginBgCZZ} width={'100%'} />
                <Form form={form} layout='horizontal' style={{ padding: '0 20px' }}>
                    <Form.Item
                        label='手机号'
                        name='account'
                        rules={[
                            { required: true },
                            { type: 'string', min: 11 },
                        ]}
                    >
                        <Input placeholder='请输入' clearable />
                    </Form.Item>
                    {
                        currentStatus !== StatusEnum.phoneLogin &&
                        <Form.Item
                            label='密码'
                            name='password'
                            rules={[
                                { required: true },
                                { type: 'string', min: 6 },
                            ]}
                            extra={
                                <div className='eye'>
                                    {!visible ? (
                                        <EyeInvisibleOutline onClick={() => setVisible(true)} />
                                    ) : (
                                        <EyeOutline onClick={() => setVisible(false)} />
                                    )}
                                </div>
                            }
                        >
                            <Input
                                placeholder='请输入密码'
                                clearable
                                type={visible ? 'text' : 'password'}
                            />
                        </Form.Item>
                    }
                    {
                        currentStatus === StatusEnum.register &&
                        <Form.Item
                            label='确认密码'
                            name='certainPassword'
                            rules={[
                                { required: true },
                                { type: 'string', min: 6 },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次输入的密码不一致！'));
                                    },
                                }),
                            ]}
                            extra={
                                <div className='eye'>
                                    {!visible ? (
                                        <EyeInvisibleOutline onClick={() => setVisible(true)} />
                                    ) : (
                                        <EyeOutline onClick={() => setVisible(false)} />
                                    )}
                                </div>
                            }
                        >
                            <Input
                                placeholder='请确认密码'
                                clearable
                                type={visible ? 'text' : 'password'}
                            />
                        </Form.Item>
                    }
                    {
                        currentStatus !== StatusEnum.pwLogin &&
                        <Form.Item
                            label='验证码'
                            name='smsCode'
                            extra={
                                <div className='extraPart' onClick={sendCode}>
                                    <a>{showTime && countTime}发送验证码</a>
                                </div>
                            }
                            rules={[
                                { required: true },
                            ]}
                        >
                            <Input placeholder='请输入' clearable />
                        </Form.Item>
                    }
                    {
                        currentStatus === StatusEnum.pwLogin && pwErrorNum > 2 &&
                        <Form.Item
                            label='验证码'
                            name='pwCode'
                            extra={
                                <Captcha ref={captchaRef} clearPwCode={clearPwCode} />
                            }
                            rules={[
                                { required: true, message: '请输入验证码' },
                                {
                                    validator: (_, value) => {
                                        const captchaCode = captchaRef.current?.getCode();
                                        if (!value || value.toLowerCase() === captchaCode?.toLowerCase()) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('验证码不正确'));
                                    }
                                }
                            ]}
                        >
                            <Input placeholder='请输入' clearable />
                        </Form.Item>
                    }
                </Form>
            </div>
            <div>
                {currentBtn}
            </div>
            <div className='login-bottom-ways'>
                {
                    statusText.current.map(item => {
                        return (
                            <div key={item.key}>
                                {item.key > 0 && <Divider direction='vertical' style={{ borderColor: 'black' }} />}
                                <span style={{ color: currentStatus === item.key ? '#1677ff' : '#090909' }} onClick={() => handleGo(item.key)}>{item.name}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
