import React, { useState } from 'react'
import { history } from 'umi'
import { SearchBar, Card } from 'antd-mobile'
import ContentList from '@/components/ContentList/ContentList'
import './index.less'
import request from "@/utils/request/request";
import { RequstStatusEnum } from "@/utils/request/request.type";

export default function Promation() {
    const [data, setData] = useState([])

    const goDetail = (item) => {
        history.push(`/promation/${item.id}?name=${item.title}`);
    }

    const getPromotionList = async (value: string) => {
        const params = {
            page: 1,
            rows: 10,
            keyword: value
        };
        const queryString = new URLSearchParams(params).toString();
        const res = await request(`/newApi/works/getTaskPageList?${queryString}`, { method: 'GET' });
        res.code === RequstStatusEnum.success && setData(res.rows)
    }
    
    return (
        <div style={{ padding: '46px 6px' }}>
            <div className="search">
                <SearchBar placeholder='请输入内容' onSearch={getPromotionList} showCancelButton={() => true} />
            </div>
            <Card title="推广任务">
                <ContentList contentList={data} isPullToRefresh={true} handleItem={goDetail} />
            </Card>
        </div>
    )
}
