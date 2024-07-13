import React, { useState } from 'react'
import { history } from 'umi'
import { SearchBar, Card } from 'antd-mobile'
import ContentList from '@/components/ContentList/ContentList'
import './index.less'

export default function Promation() {
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
    const goDetail = (item) => {
        history.push(`/promation/${item.id}?name=${item.name}`);
    }
    return (
        <div style={{ padding: '46px 6px' }}>
            <div className="search">
                <SearchBar placeholder='请输入内容' showCancelButton={() => true} />
            </div>
            <Card title="推广任务">
                <ContentList contentList={data} isPullToRefresh={true} handleItem={goDetail} />
            </Card>
        </div>
    )
}
