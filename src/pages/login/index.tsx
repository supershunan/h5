import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'umi';
import { Form, Input, Divider, Button, Toast, Image } from 'antd-mobile';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { StatusEnum, PhoneLogin, Registor, PwLogin } from './index.type';
import LoginBg from './../../assets/images/welcome.jpg';
import './index.less';
import '@/pages/global.less';

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

    const sendCode = () => {

    }

    const handleGo = (key: number) => {
        setCurrentStatus(key);
    }

    const handleLoginOrRegidter = () => {
        const values: PhoneLogin | Registor | PwLogin = form.getFieldsValue();
        console.log(values);
        if (currentStatus === StatusEnum.register) {
            Toast.show({
                icon: 'success',
                content: '注册成功',
            });
            setCurrentStatus(StatusEnum.phoneLogin);
        }
        form.resetFields();
        window.localStorage.setItem('isLogin', true);
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
                    <Form.Item label='手机号' name='phone'>
                        <Input placeholder='请输入' clearable />
                    </Form.Item>
                    {
                        currentStatus !== StatusEnum.pwLogin &&
                        <Form.Item
                            label='验证码'
                            name='code'
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
