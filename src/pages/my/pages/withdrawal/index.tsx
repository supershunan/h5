import React, { useState } from 'react'
import NavBarBack from '@/components/NavBarBack/NavBarBack'
import { Avatar, Button, Card, Form, ImageUploader, ImageUploadItem, Input, Picker, TextArea } from 'antd-mobile'
import './index.less'

export default function withdrawal() {
    const [fileList, setFileList] = useState<ImageUploadItem[]>([
        {
            url: 'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
        }
    ])
    const [visible, setVisible] = useState(false)
    const [value, setValue] = useState<(string | null)[]>(['M'])
    const basicColumns = [
        [
            { label: '周一', value: 'Mon' },
            { label: '周二', value: 'Tues' },
            { label: '周三', value: 'Wed' },
            { label: '周四', value: 'Thur' },
            { label: '周五', value: 'Fri' },
        ]
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
            <NavBarBack content={'提现'} style={{ background: '#fff', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div style={{ padding: '0 6px', marginTop: '20px' }}>
                <Card>
                    <Form
                        name='form'
                        onFinish={onFinish}
                        layout='horizontal'
                    >
                        <Form.Item name='price' label='提现金额'>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Input placeholder='请输入' type='number' />
                                <Button style={{ width: '150px', fontSize: '13px' }}>
                                    全部提现
                                </Button>
                            </div>
                        </Form.Item>
                        <Form.Item
                            name='collection'
                            label='提现方式'
                            trigger='onConfirm'
                            onClick={(e) => {
                                console.log(e)
                                setVisible(true)
                            }}
                        >
                            <Picker
                                columns={basicColumns}
                                visible={visible}
                                value={value}
                                onClose={() => {
                                    setVisible(false)
                                }}
                                onConfirm={v => {
                                    setValue(v)
                                }}
                                onSelect={(val, extend) => {
                                    console.log('onSelect', val, extend.items)
                                }}
                            >
                                {(items, { open }) => {
                                    return (
                                        <>
                                            {items.every(item => item === null)
                                                ? '未选择'
                                                : items.map(item => item?.label ?? '未选择').join(' - ')}
                                        </>
                                    )
                                }}
                            </Picker>
                        </Form.Item>
                        <Form.Item
                            name='name'
                            label='姓名'
                        >
                            <Input onChange={console.log} placeholder='请输入' />
                        </Form.Item>
                        <Form.Item name='amount' label='账号'>
                            <Input onChange={console.log} placeholder='请输入' />
                        </Form.Item>
                    </Form>
                </Card>
                <Card style={{ margin: '10px 0' }}>提现规则</Card>
                <Button block type='submit' color='primary' size='large'>
                    确认提现
                </Button>
            </div>
        </div>
    )
}
