import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'umi';
import { Form, Input, Divider, Button, Toast, Image } from 'antd-mobile';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { StatusEnum, PhoneLogin, Registor, PwLogin, LoginTypeEnum } from './index.type';
import LoginBg from './../../assets/images/welcome.jpg';
import './index.less';
import '@/pages/global.less';
import request from '@/utils/request/request';
import { RequstStatusEnum } from '@/utils/request/request.type';
import { md5 } from 'js-md5';

export default function Login() {
    const [currentStatus, setCurrentStatus] = useState(StatusEnum.phoneLogin);
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
        const values: PhoneLogin | Registor | PwLogin = form.getFieldsValue();
        await sendSms(values?.account as number);
    }

    const handleGo = (key: number) => {
        setCurrentStatus(key);
    }

    const handleLoginOrRegidter = async () => {
        let status;
        const values: PhoneLogin | Registor | PwLogin = form.getFieldsValue();
        console.log(values);
        if (currentStatus === StatusEnum.register) {
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
                Toast.show({
                    icon: 'fail',
                    content: '登录失败',
                });
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
            }
        }
        navigate('/');
    }

    const currentBtn = useMemo(() => {
        if (currentStatus === StatusEnum.register) {
            return (
                <div className='btn'>
                    <Button onClick={handleLoginOrRegidter} style={{ padding: '7px 85px' }} color='primary'>注册</Button>
                </div>
            );
        }
        return (
            <div className='btn'>
                <Button onClick={handleLoginOrRegidter} style={{ padding: '7px 85px' }} color='primary'>登录</Button>
            </div>
        );
    }, [currentStatus])

    return (
        <div className='login'>
            <div className="login-content">
                <Image
                    src={LoginBg}
                    width={'100%'}
                    height={'168px'}
                    fit='cover'
                />
                <Form form={form} layout='horizontal'>
                    <Form.Item label='手机号' name='account'>
                        <Input placeholder='请输入' clearable />
                    </Form.Item>
                    {
                        currentStatus !== StatusEnum.pwLogin &&
                        <Form.Item
                            label='验证码'
                            name='smsCode'
                            extra={
                                <div className='extraPart' onClick={sendCode}>
                                    <a>发送验证码</a>
                                </div>
                            }
                        >
                            <Input placeholder='请输入' clearable />
                        </Form.Item>
                    }
                    {
                        currentStatus !== StatusEnum.phoneLogin &&
                        <Form.Item
                            label='密码'
                            name='password'
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
                </Form>
            </div>
            {currentBtn}
            <div className='login-bottom-ways'>
                {
                    statusText.current.map(item => {
                        return (
                            <div key={item.key}>
                                {item.key > 0 && <Divider direction='vertical' />}
                                <span onClick={() => handleGo(item.key)}>{item.name}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
