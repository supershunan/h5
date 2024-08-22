import { useState } from 'react'
import { InfiniteScroll, List, Modal } from 'antd-mobile';
import NavBarBack from '@/components/NavBarBack/NavBarBack'
import styles from './index.less';
import request from '@/utils/request/request';
import { RequstStatusEnum } from '@/utils/request/request.type';

export default function HistoryNotice() {
    const [historyItems, setHistoryItems] = useState<{ id: number, title: string, content: string }[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [params, setParmas] = useState<{ page: number, rows: number }>({ page: 1, rows: 5 });

    const noticeDetail = (content: string) => {
        Modal.alert({ content })
    }

    const loadHistoryItems = async () => {
        const res = await request('/newApi/noticeList/page', {
            method: 'POST',
            body: params,
        });
        const status = res.code === RequstStatusEnum.success && res.rows.length > 0;

        if (status) {
            setHistoryItems([
                ...historyItems,
                ...res.rows
            ]);
            setParmas({
                page: params.page + 1,
                rows: params.rows
            })
        }
        setHasMore(status)
    }

    return (
        <div className={styles.historyContainer}>
            <NavBarBack content={'历史公告'} style={{ maxWidth: '450px', background: '#fff', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <List header='历史公告'>
                {
                    historyItems.map(item => <List.Item key={item.id} onClick={() => noticeDetail(item.content)} arrowIcon={<div style={{color: '#3086ff'}}>查看</div>}>{item.title}</List.Item>)
                }
            </List>
            <InfiniteScroll loadMore={loadHistoryItems} hasMore={hasMore} />
        </div>
    )
}
