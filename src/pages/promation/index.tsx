import React, { useEffect, useState } from 'react'
import { history } from 'umi'
import { SearchBar, Card, InfiniteScroll } from 'antd-mobile'
import ContentList from '@/components/ContentList/ContentList'
import './index.less'
import request from "@/utils/request/request";
import { RequstStatusEnum } from "@/utils/request/request.type";

export default function Promation() {
    const [data, setData] = useState([])
    const [hasMore, setHasMore] = useState(true);
    const [params, setParmas] = useState<{ page: number, rows: number, keyword: string }>({ page: 1, rows: 5, keyword: ''});
    const [isSearch, setIsSearch] = useState(false);

    const goDetail = (item) => {
        history.push(`/promation/${item.id}?name=${item.title}`);
    }

    useEffect(() => {
        if (isSearch) {
            loadAllVideoList();
        }
    }, [params]);

    const getPromotionList = async (value: string) => {
        setIsSearch(true);
        setParmas({
            page: 1,
            rows: 10,
            keyword: value
        })
    }

    const loadAllVideoList = async () => {
        const queryString = new URLSearchParams(params).toString();
        const res = await request(`/newApi/works/getTaskPageList?${queryString}`, { method: 'GET' });
        const status = res.code === RequstStatusEnum.success && res.rows.length > 0;

        if (status && !isSearch) {
            setData([
                ...data,
                ...res.rows
            ]);
            setParmas({
                page: params.page + 1,
                rows: params.rows,
                keyword: params.keyword
            })
        }

        if (isSearch) {
            setData(res.rows);
            setParmas({
                page: params.page + 1,
                rows: params.rows,
                keyword: params.keyword
            });
            setIsSearch(false);
        }
        setHasMore(status)
    }
    
    return (
        <div style={{ padding: '46px 6px' }}>
            <div className="search">
                <SearchBar placeholder='请输入内容' onSearch={getPromotionList} showCancelButton={() => true} />
            </div>
            <Card title="推广任务">
                <ContentList contentList={data} isPullToRefresh={true} handleItem={goDetail} />
            </Card>
            <InfiniteScroll loadMore={loadAllVideoList} hasMore={hasMore} />
        </div>
    )
}
