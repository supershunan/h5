import React, { useState } from 'react'
import { useParams, useLocation, history } from 'umi'
import NavBarBack from '@/components/NavBarBack/NavBarBack';
import { Dialog, Button, Modal } from 'antd-mobile';
import { ItemOperateEnum } from './type';
import { Action } from 'antd-mobile/es/components/popover'
import ContentList from '@/components/ContentList/ContentList';
import styles from './index.css';

export default function Id() {
    const { id } = useParams<{ id: string, name: string }>();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const name = params.get('name');
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
        { key: ItemOperateEnum.setting, text: '设置' },
        { key: ItemOperateEnum.delete, text: '删除' },
    ]
    const handlePop = (node: Action, item) => {
        switch (node.key) {
            case ItemOperateEnum.setting:
                history.push(`/uploadVideo`);
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
    const openVideo = (url) => {
        Modal.alert({
            image:
                'https://gw.alipayobjects.com/mdn/rms_efa86a/afts/img/A*SE7kRojatZ0AAAAAAAAAAAAAARQnAQ',
            title: '手持工牌照示例',
            content: '请用手机拍摄手持工牌照，注意保持照片清晰',
        })
    }

    return (
        <div style={{ padding: '46px 0' }}>
            <NavBarBack content={name as string} style={{ background: '#f8f8fb', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div style={{ padding: '6px 6px' }}>
                <ContentList contentList={data} actions={actions} handlePop={handlePop} handleItem={openVideo} />
                <div className={styles.floatBtn}>
                    <Button onClick={() => {  history.push('/uploadVideo') }} block color='primary' size='large'>
                        上传视频
                    </Button>
                </div>
            </div>
        </div>
    )
}
