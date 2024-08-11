import React, { useEffect, useState } from 'react'
import { history } from 'umi'
import NavBarBack from '@/components/NavBarBack/NavBarBack'
import { Footer, Button, Card, Form, ImageUploader, ImageUploadItem, Input, Toast } from 'antd-mobile'
import './index.less'
import request from '@/utils/request/request';
import { RequstStatusEnum } from '@/utils/request/request.type';

export default function Setting() {
    const [form] = Form.useForm();
    const [userInfo, setUserInfo] = useState<{ nickname: string; avatar: string; }>();
    const [fileList, setFileList] = useState<ImageUploadItem[]>([
        {
            url: 'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
        }
    ]);
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

    useEffect(() => {
        getUserInfo();
    }, []);

    const onFinish = () => {
        resetUserInfo()
    }

    const resetUserInfo = async () => {
        const formValue = form.getFieldsValue();
        const data1 = {
            avatar: "",
            nickname: formValue.nickname
        }
        const res = await request('/newApi/user/updateMyInfo', {
            method: 'POST',
            body: data1
        })
        const data2 = { password: formValue.password };
        const res2 = await request('/newApi/user/updatePwd', {
            method: 'POST',
            body: data2
        })

        Promise.all([res, res2]).then(res => {
            let isSuccess = true;
            res.forEach(item => {
                if (item.code !== RequstStatusEnum.success) {
                    isSuccess = false;
                }
            })

            if (isSuccess) {
                Toast.show('更新成功');
                history.back();
            } else {
                Toast.show('更新失败');
            }
        })
    }

    const onLinkClick = (item: any, index: number) => {
        history.push(item.href)
    }

    function beforeUpload(file: File) {
        if (file.size > 1024 * 1024) {
            Toast.show('请选择小于 1M 的图片')
            return null
        }
        return file
    }

    const uploadImg = async (file: File): Promise<ImageUploadItem> => {
        console.log(file)
        const formData = new FormData();
        formData.append('file', file);
        return await request('/apiFile/file/upload', {
            method: 'POST',
            body: formData,
        }) 
    }
    const onBinding = () => {}

    const onExit = () => {
        localStorage.removeItem('Token');
        history.push('/login');
    }

    const getUserInfo = async () => {
        const res = await request('/newApi/user/myInfo', { method: 'GET'});
        if (res.code === RequstStatusEnum.success) {
            console.log(res.data)
            setUserInfo(res.data)
        }
    }

    return (
        <div style={{ padding: '46px 0' }}>
            <NavBarBack content={'设置'} style={{ background: '#fff', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div style={{ padding: '0 6px', marginTop: '60px' }}>
                <Card
                    title={
                        <div className='advator'>
                           <ImageUploader
                                value={fileList}
                                onChange={setFileList}
                                upload={''}
                                beforeUpload={beforeUpload}
                                maxCount={1}
                                style={{ borderRadius: '50px'}}
                            />
                        </div>
                    }
                >
                    <Form
                        name="form"
                        form={form}
                        layout='horizontal'
                        initialValues={userInfo}
                    >
                        <Form.Item
                            name='nickname'
                            label='昵称'
                        >
                             <Input placeholder="请输入" />
                        </Form.Item>
                        <Form.Item name='password' label='修改密码'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                    </Form>
                </Card>
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
