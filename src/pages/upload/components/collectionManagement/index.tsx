import React, { useState } from 'react'
import { Toast, Dialog, Button, Popup, Form, Input, ImageUploader, ImageUploadItem, Checkbox } from 'antd-mobile'
import { history } from 'umi';
import { Action } from 'antd-mobile/es/components/popover'
import NavBarBack from '@/components/NavBarBack/NavBarBack'
import { ItemOperateEnum } from './type';
import './index.less';
import ContentList from '@/components/ContentList/ContentList';

function getNextData() {
    const ret: string[] = []
    for (let i = 0; i < 18; i++) {
        //   ret.unshift(lorem.generateWords(1))
    }
    return ret
}
export default function CollectionManagement() {
    const [data, setData] = useState([
        {
            id: 0,
            name: '合集名0',
        },
        {
            id: 1,
            name: '合集名1',
        },
        {
            id: 1,
            name: '合集名1',
        },
        {
            id: 1,
            name: '合集名1',
        },
        {
            id: 1,
            name: '合集名1',
        },
        {
            id: 1,
            name: '合集名1',
        },
        {
            id: 1,
            name: '合集名1',
        }
    ])
    const actions: Action[] = [
        { key: ItemOperateEnum.setting, text: '设置' },
        { key: ItemOperateEnum.startPromotion, text: '开始推广' },
        { key: ItemOperateEnum.overPromotion, text: '关闭推广' },
        { key: ItemOperateEnum.delete, text: '删除' },
    ]
    const [visible1, setVisible1] = useState(false)
    const [fileList, setFileList] = useState<ImageUploadItem[]>()
    const [form] = Form.useForm();

    const handlePop = (node: Action, item) => {
        switch (node.key) {
            case ItemOperateEnum.setting:
                setVisible1(true)
                break;
            case ItemOperateEnum.startPromotion:
                Dialog.show({
                    content: '开启推广?',
                    closeOnAction: true,
                    actions: [
                        [
                            {
                                key: 'cancel',
                                text: '取消',
                            },
                            {
                                key: 'ok',
                                text: '确认',
                                bold: true,
                                danger: true,
                                onClick: () => { console.log(item.id, 'ok') }
                            },
                        ],
                    ],
                })
                break;
            case ItemOperateEnum.overPromotion:
                Dialog.show({
                    content: '关闭推广?',
                    closeOnAction: true,
                    actions: [
                        [
                            {
                                key: 'cancel',
                                text: '取消',
                            },
                            {
                                key: 'ok',
                                text: '确认',
                                bold: true,
                                danger: true,
                                onClick: () => { console.log(item.id, 'ok') }
                            },
                        ],
                    ],
                })
                break;
            case ItemOperateEnum.delete:
                Dialog.show({
                    content: '确认删除吗?',
                    closeOnAction: true,
                    actions: [
                        [
                            {
                                key: 'cancel',
                                text: '取消',
                            },
                            {
                                key: 'delete',
                                text: '删除',
                                bold: true,
                                danger: true,
                                onClick: () => { console.log(item.id, 'delete') }
                            },
                        ],
                    ],
                })
                break;

            default:
                break;
        }
        console.log(node, item)
    }
    const goDetail = (item) => {
        history.push(`/collectionManagement/${item.id}?name=${item.name}`);
    }

    function beforeUpload(file: File) {
        if (file.size > 1024 * 1024) {
            Toast.show('请选择小于 1M 的图片')
            return null
        }
        return file
    }
    
    const handleAdd = () => {
        setVisible1(false)
        Toast.show({
            content: '创建成功'
        })
        form.resetFields();
    }

    return (
        <div className='collectionContainer' style={{ padding: '46px 0' }}>
            <NavBarBack content={'合集管理'} style={{ background: '#f8f8fb', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div className='collectContent'>
                <ContentList contentList={data} actions={actions} handlePop={handlePop} handleItem={goDetail} />
                <div className="floatBtn">
                    <Button onClick={() => { setVisible1(true) }} block color='primary' size='large'>
                        创建合辑
                    </Button>
                </div>
                <Popup
                    visible={visible1}
                    onMaskClick={() => {
                        setVisible1(false)
                    }}
                    onClose={() => {
                        setVisible1(false)
                    }}
                    showCloseButton
                    bodyStyle={{
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        minHeight: '40vh',
                    }}
                >
                    <div className="createcollection">
                        <Form
                            form={form}
                            onFinish={handleAdd}
                            footer={
                                <Button block type='submit' color='primary' size='large'>
                                    提交
                                </Button>
                            }
                        >
                            <Form.Header>
                                <div style={{ textAlign: 'center' }}>创建合集</div>
                            </Form.Header>
                            <Form.Item
                                name='name'
                                label='合集名'
                            >
                                <Input onChange={console.log} placeholder='请输入' />
                            </Form.Item>
                            <Form.Item
                                name='pic'
                                label='合集封面'
                            >
                                <ImageUploader
                                    value={fileList}
                                    onChange={setFileList}
                                    upload={''}
                                    beforeUpload={beforeUpload}
                                    maxCount={1}
                                />
                            </Form.Item>
                            <Form.Item
                                name='spread'
                                label='推广'
                            >
                                <Input onChange={console.log} placeholder='请输入' />
                            </Form.Item>
                            <Form.Item
                                name='spreadStatu'
                                label='是否推广'
                            >
                                <Checkbox>是</Checkbox>
                            </Form.Item>
                        </Form>
                    </div>
                </Popup>
            </div>
        </div>
    )
}
