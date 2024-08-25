import React, { useEffect, useState } from 'react'
import { history } from 'umi'
import NavBarBack from '@/components/NavBarBack/NavBarBack'
import { Footer, Button, Card, Form, ImageUploader, ImageUploadItem, Input, Toast } from 'antd-mobile'
import './index.less'
import request from '@/utils/request/request';
import { RequstStatusEnum } from '@/utils/request/request.type';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { md5 } from 'js-md5';

export default function Setting() {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false)
    const links = [
        {
            text: '隐私策略',
            href: '/privacyPolicy',
        },
        {
            text: '用户协议',
            href: '/userAgreement',
        },
    ]


    const onFinish = () => {
        resetUserInfo()
    }

    const resetUserInfo = async () => {
        const formValue = form.getFieldsValue();
        console.log(formValue)
        if ((formValue.password || formValue.passwordCertain) && (formValue.password !== formValue.passwordCertain)) {
            Toast.show('密码不一致，请检查');
            return;
        }
        let updatePasswordStatus = true;
        if (typeof formValue.password === 'string' && typeof formValue.passwordCertain === 'string') {
            const data2 = { password: md5(formValue.password) };
            const res = await request('/newApi/user/updatePwd', {
                method: 'POST',
                body: data2
            })
            updatePasswordStatus = res.code === RequstStatusEnum.success
        }

        if (updatePasswordStatus) {
            Toast.show('更新成功');
            history.back();
        } else {
            Toast.show('更新失败');
        }
    }

    const onLinkClick = (item: any, index: number) => {
        history.push(item.href)
    }

    const onBinding = () => { }

    const onExit = () => {
        localStorage.removeItem('Token');
        history.push('/login');
    }

    return (
        <div style={{ padding: '46px 0' }}>
            <NavBarBack content={'设置'} style={{ maxWidth: '450px', background: '#fff', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div style={{ padding: '0 6px' }}>
                <Card>
                    <div></div>
                </Card>
                <Form
                    name="form"
                    form={form}
                    layout='horizontal'
                >
                    <Form.Item
                        name='password'
                        label='修改密码'
                        extra={
                        <div className='eye'>
                            {!visible ? (
                                <EyeInvisibleOutline onClick={() => setVisible(true)} />
                            ) : (
                                <EyeOutline onClick={() => setVisible(false)} />
                            )}
                        </div>}
                        rules={[
                            { type: 'string', min: 6 },
                        ]}
                    >
                        <Input placeholder='请输入' type={visible ? 'text' : 'password'} />
                    </Form.Item>
                    <Form.Item
                        name='passwordCertain'
                        label='确认密码'
                        extra={
                        <div className='eye'>
                            {!visible ? (
                                <EyeInvisibleOutline onClick={() => setVisible(true)} />
                            ) : (
                                <EyeOutline onClick={() => setVisible(false)} />
                            )}
                        </div>}
                        rules={[
                            { type: 'string', min: 6 },
                        ]}
                    >
                        <Input placeholder='请输入' type={visible ? 'text' : 'password'} />
                    </Form.Item>
                </Form>
                <Button onClick={onFinish} block type='submit' color='primary' size='large' style={{ marginTop: '10px' }}>
                    提交
                </Button>
                <Button onClick={onBinding} block size='large' style={{ marginTop: '10px' }}>
                    账号绑定
                </Button>
                <Button onClick={onExit} block size='large' style={{ marginTop: '10px' }}>
                    退出登录
                </Button>
            </div>
            <Footer links={links} onLinkClick={onLinkClick}></Footer>
        </div>
    )
}
