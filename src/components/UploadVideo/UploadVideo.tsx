import React, { useState } from 'react'
import { history } from 'umi';
import { ImageUploader, ImageUploadItem, Toast, Picker } from 'antd-mobile';
import {
    Form,
    Input,
    Button,
    TextArea,
} from 'antd-mobile'
import './index.less';

export default function UploadVideo() {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<ImageUploadItem[]>()
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

    function beforeUpload(file: File) {
        if (file.size > 1024 * 1024) {
            Toast.show('请选择小于 1M 的图片')
            return null
        }
        return file
    }
    const onFinish = (values: any) => {
        console.log(values)
        form.resetFields();
        Toast.show('上传成功');
        history.back();
    }
    return (
        <div>
            <Form
                name='form'
                form={form}
                onFinish={onFinish}
                footer={
                    <Button block type='submit' color='primary' size='large'>
                        提交
                    </Button>
                }
            >
                <div className="uploadImgVideo">
                    <Form.Item name='upladImg'>
                        <div className="upladImg">
                            <div className='uploadTip'>
                                <span className='uploadHeadtitle'>上传封面</span>
                                <span className='uploadSubtitle'>尺寸(750/422)</span>
                            </div>
                            <ImageUploader
                                value={fileList}
                                onChange={setFileList}
                                upload={''}
                                beforeUpload={beforeUpload}
                                maxCount={1}
                            />
                        </div>
                    </Form.Item>
                    <Form.Item name='upladVideo'>
                        <div className="upladVideo">
                            <div className='uploadTip'>
                                <span className='uploadHeadtitle'>上传视频</span>
                                <span className='uploadSubtitle'>小于200Mb</span>
                            </div>
                            <ImageUploader
                                value={fileList}
                                onChange={setFileList}
                                upload={''}
                                beforeUpload={beforeUpload}
                                maxCount={1}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </Form.Item>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Form.Item name='price' label={<div>价格<span style={{ color: '#ff3141', fontSize: '10px' }}>100次元币=1元</span></div>}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Input placeholder='请输入' type='number' />
                            <div style={{ width: '80px', fontSize: '13px' }}>
                                次元币
                            </div>
                        </div>
                    </Form.Item>
                    <Form.Item name='address' label='集数'>
                        <Input placeholder='请输入' type='number' />
                    </Form.Item>
                </div>
                <Form.Item
                    name='classify'
                    label='分类'
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
                    name='collection'
                    label='合集选择'
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
                <Form.Item name='videoName' label='视频名'>
                    <Input placeholder='请输入' />
                </Form.Item>
                <Form.Item name='blurb' label='简介'>
                    <TextArea
                        placeholder='请输入'
                        maxLength={30}
                        rows={2}
                        showCount
                    />
                </Form.Item>
            </Form>
        </div>
    )
}
