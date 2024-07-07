import React, { useState } from 'react'
import { history } from 'umi';
import { InfiniteScroll, List, NavBar, Modal } from 'antd-mobile';
import styles from './index.less';

export default function HistoryNotice() {
    const [historyItems, setHistoryItems] = useState([
        {
            id: 0,
            name: '历史公告1',
            content: 'hello world'
        },
        {
            id: 1,
            name: '历史公告1',
            content: 'hello umi'
        },
    ]);
    const [hasMore, setHasMore] = useState(true)
    async function loadMore() {
        const append = [
            {
                id: 2,
                name: '历史公告2',
                content: 'hello world'
            },
            {
                id: 3,
                name: '历史公告3',
                content: 'hello umi'
            },
        ]
        hasMore && setHistoryItems(val => [...val, ...append])
        setHasMore(false)
    }

    const back = () => {
        history.back();
    }

    const noticeDetail = (content: string) => {
        Modal.alert({
            // image:
            //   'https://gw.alipayobjects.com/mdn/rms_efa86a/afts/img/A*SE7kRojatZ0AAAAAAAAAAAAAARQnAQ',
            // title: '手持工牌照示例',
            content,
        })
    }

    return (
        <div className={styles.historyContainer}>
            <NavBar back='返回' onBack={back}>
                历史公告
            </NavBar>
            <List header='历史公告'>
                {
                    historyItems.map(item => <List.Item key={item.id} onClick={() => noticeDetail(item.content)} arrowIcon={<div style={{color: '#3086ff'}}>查看</div>}>{item.name}</List.Item>)
                }
            </List>
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
        </div>
    )
}
