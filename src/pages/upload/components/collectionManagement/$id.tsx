import React, { useEffect, useState } from 'react'
import { useParams, useLocation, history } from 'umi'
import NavBarBack from '@/components/NavBarBack/NavBarBack';
import { Dialog, Button, Modal, InfiniteScroll, Toast } from 'antd-mobile';
import { ItemOperateEnum } from './type';
import { Action } from 'antd-mobile/es/components/popover'
import ContentList from '@/components/ContentList/ContentList';
import styles from './index.css';
import request from "@/utils/request/request";
import { RequstStatusEnum } from "@/utils/request/request.type";

export default function Id() {
    const { id } = useParams<{ id: string, name: string }>();
    const { search } = useLocation();
    const urlParams = new URLSearchParams(search);
    const name = urlParams.get('name');
    const [data, setData] = useState<any[]>([])
    const actions: Action[] = [
        { key: ItemOperateEnum.setting, text: '设置' },
        { key: ItemOperateEnum.delete, text: '删除' },
    ]
    const [hasMore, setHasMore] = useState(true);
    const [params, setParmas] = useState<{ page: number, rows: number, pid: number, type: string }>({ page: 1, rows: 5, pid: Number(id), type: 'video' });
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        if (isLoad) {
            loadVideoList();
        }
    }, [params]);

    const handlePop = (node: Action, item) => {
        switch (node.key) {
            case ItemOperateEnum.setting:
                history.push(`/uploadVideo?id=${item.id}&type=edit`);
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
                                onClick: () => {
                                    deleteVideo(item.id)
                                    reload();
                                }
                            },
                        ],
                    ],
                })
                break;
            default:
                break;
        }
    }
    const openVideo = (item: { title: string; playUrl: string | undefined; }) => {
        Modal.alert({
            title: item?.title,
            content: <div>
                {
                    item?.playUrl ?  <video style={{ width: '100%', height: '246px' }} src={item?.playUrl} controls></video>
                    : <span>暂无视频源</span>
                }
            </div>,
        })
    }

    const loadVideoList = async () => {
        const res = await request('/newApi/works/page', {
            method: 'POST',
            body: params,
        });
        const status = res.code === RequstStatusEnum.success && res.rows.length > 0;

        if (status && !isLoad) {
            setData([
                ...data,
                ...res.rows
            ]);
            setParmas({
                page: params.page + 1,
                rows: params.rows,
                pid: Number(id),
                type: 'video'
            })
        }

        if (isLoad) {
            setData(res.rows);
            setParmas({
                page: params.page + 1,
                rows: params.rows,
                pid: Number(id),
                type: 'video'
            });
            setIsLoad(false);
        }
        setHasMore(status)
    }

    const deleteVideo = async (id: number) => {
        const data = {
            ids: id,
        }
        const res = await request('/newApi/works/del', {
            method: 'POST',
            body: data
        });
        Toast.show({
            content: res.code === RequstStatusEnum.success ? "删除成功" : "删除失败",
        });
    }

    const reload =() => {
        setIsLoad(true);
        setParmas({
            page: 1,
            rows: 5,
            pid: Number(id),
            type: 'video'
        });
    };

    return (
        <div style={{ padding: '46px 0' }}>
            <NavBarBack content={name as string} style={{ maxWidth: '450px', background: '#f8f8fb', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div style={{ padding: '6px 6px' }}>
                <ContentList contentList={data} actions={actions} handlePop={handlePop} handleItem={openVideo} />
                <div className={styles.floatBtn}>
                    <Button onClick={() => {  history.push(`/uploadVideo?id=${id}&type=add`) }} block color='primary' size='large'>
                        上传视频
                    </Button>
                </div>
            </div>
            <InfiniteScroll loadMore={loadVideoList} hasMore={hasMore} />
        </div>
    )
}
