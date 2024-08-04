import React, { useState } from 'react'
import NavBarBack from '@/components/NavBarBack/NavBarBack'
import { Footer, Button, Card, Form, ImageUploader, ImageUploadItem, Input, Toast } from 'antd-mobile'
import './index.less'
import request from '@/utils/request/request';
import { RequstStatusEnum } from '@/utils/request/request.type';

export default function Setting() {
    const [fileList, setFileList] = useState<ImageUploadItem[]>([
        {
            url: 'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
        }
    ]);
    const links = [
        {
          text: '隐私策略',
          href: 'https://www.aliyun.com/',
        },
        {
          text: '用户协议',
          href: 'https://www.antgroup.com/',
        },
    ]
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        resetUserInfo()
    }
    function beforeUpload(file: File) {
        if (file.size > 1024 * 1024) {
            Toast.show('请选择小于 1M 的图片')
            return null
        }
        console.log('wkk', file)
        return file
    }
    const resetUserInfo = async () => {
        const formValue = form.getFieldsValue();
        const data1 = JSON.stringify({
            avatar: "http://dummyimage.com/100x100",
            nickname: formValue.nickname
        })
        const data2 = JSON.stringify({ password: formValue.password });
        // const res = await request('/newApi/user/updateMyInfo', {
        //     method: 'POST',
        //     body: data1
        // })
        // const res2 = await request('/newApi/user/updatePwd', {
        //     method: 'POST',
        //     body: data2
        // })
    }

    const onLinkClick = (item: any, index: number) => {
        console.log(item, index);
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
    const onBinding = () => {

    }

    const onExit = () => {

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
                        name='form'
                        form={form}
                        onFinish={onFinish}
                        layout='horizontal'
                    >
                        <Form.Item
                            name='nickname'
                            label='昵称'
                        >
                            <Input placeholder='请输入' />
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
