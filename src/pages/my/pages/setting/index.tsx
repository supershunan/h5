import React, { useState } from 'react'
import NavBarBack from '@/components/NavBarBack/NavBarBack'
import { Avatar, Button, Card, Form, ImageUploader, ImageUploadItem, Input, TextArea } from 'antd-mobile'
import './index.less'

export default function Setting() {
    const [fileList, setFileList] = useState<ImageUploadItem[]>([
        {
            url: 'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
        }
    ])
    const demoAvatarImages = [
        ,
    ]
    const onFinish = (values: any) => {
        console.log(values)
    }
    function beforeUpload(file: File) {
        if (file.size > 1024 * 1024) {
            Toast.show('请选择小于 1M 的图片')
            return null
        }
        return file
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
                        onFinish={onFinish}
                        layout='horizontal'
                    >
                        <Form.Item
                            name='name'
                            label='昵称'
                        >
                            <Input onChange={console.log} placeholder='请输入' />
                        </Form.Item>
                        <Form.Item name='amount' label='修改密码'>
                            <Input onChange={console.log} placeholder='请输入' />
                        </Form.Item>
                    </Form>
                </Card>
                <Card style={{ marginTop: '10px' }}>
                    <div>隐私策略</div>
                    <div>用户协议</div>
                </Card>
                <Button block type='submit' color='primary' size='large' style={{ marginTop: '10px' }}>
                    提交
                </Button>
                <Button block size='large' style={{ marginTop: '10px' }}>
                    账号绑定
                </Button>
                <Button block size='large' style={{ marginTop: '10px' }}>
                    退出登录
                </Button>
            </div>
        </div>
    )
}
