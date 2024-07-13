import React, { useState } from 'react'
import { history } from 'umi';
import { Button, Dialog, Modal } from 'antd-mobile'
import { Action } from 'antd-mobile/es/components/action-sheet'
import NavBarBack from '@/components/NavBarBack/NavBarBack'
import ContentList from '@/components/ContentList/ContentList'
import './index.less'

export default function VideoManagement() {
    const [data, setData] = useState([
        {
            id: 0,
            name: '视频名0',
        },
        {
            id: 1,
            name: '视频名1',
        },
        {
            id: 1,
            name: '视频名1',
        },
        {
            id: 1,
            name: '视频名1',
        },
        {
            id: 1,
            name: '视频名1',
        },
        {
            id: 1,
            name: '视频名1',
        },
        {
            id: 1,
            name: '视频名1',
        }
    ])
    const actions: Action[] = [
        { key: 0, text: '设置',},
        { key: 1, text: '删除' },
    ]

    const handlePop = (node, item) => {
        console.log(node, item)
        switch (node.key) {
            case 0:
                console.log('ha')
                break;
            case 1:
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
    }
    const openVideo = (item) => {
        Modal.alert({
            image:
                'https://gw.alipayobjects.com/mdn/rms_efa86a/afts/img/A*SE7kRojatZ0AAAAAAAAAAAAAARQnAQ',
            title: '手持工牌照示例',
            content: '请用手机拍摄手持工牌照，注意保持照片清晰',
        })
    }
    return (
        <div style={{ padding: '46px 0' }}>
            <NavBarBack content={'视频管理'} style={{ background: '#f8f8fb', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div style={{ padding: '6px 6px' }}>
                <ContentList contentList={data} actions={actions} handlePop={handlePop} handleItem={openVideo} />
                <div className='floatBtn'>
                    <Button onClick={() => { history.push('/uploadVideo') }} block color='primary' size='large'>
                        上传视频
                    </Button>
                </div>
            </div>
        </div>
    )
}
