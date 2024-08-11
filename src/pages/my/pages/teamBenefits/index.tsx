import React, { useEffect, useState } from 'react'
import { Avatar, Card, InfiniteScroll, List } from 'antd-mobile'
import NavBarBack from '@/components/NavBarBack/NavBarBack'
import request from '@/utils/request/request';
import { RequstStatusEnum } from '@/utils/request/request.type';
import { BenefitsEnum, MoneyTypeEnum } from '@/utils/type/global.type'

export default function TeamBenefits() {
    const [data, setData] = useState<any[]>([
        {
            id: 1,
            createBy: 'test1',
            integer: 1, // 流水方式，1-增加、2-减少
            money: '100',
        },
        {
            id: 2,
            createBy: 'test1',
            integer: 1,
            money: '100',
        },
        {
            id: 3,
            createBy: 'test1',
            integer: 2,
            money: '100',
        }
    ])
    const [hasMore, setHasMore] = useState(true);
    const [params, setParmas] = useState<{ page: number, rows: number }>({ page: 1, rows: 5 });
    const demoAvatarImages = [
        'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    ]

    const loadHistoryItems = async () => {
        const res = await request(`/newApi/moneyLog/pageMy/${BenefitsEnum.teamBenfits}`, {
            method: 'POST',
            body: params,
        });
        const status = res.code === RequstStatusEnum.success && res.rows.length > 0;

        if (status) {
            const newData = res.rows.filter(item => item.type === MoneyTypeEnum.income)
            setData([
                ...data,
                ...newData
            ]);
            setParmas({
                page: params.page + 1,
                rows: params.rows
            })
        }
        setHasMore(status)
    }

    return (
        <div style={{ padding: '46px 0' }}>
            <NavBarBack content={'团队收益'} style={{ background: '#fff', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div style={{ padding: '6px' }}>
                <List style={{ '--border-top': '0' }}>
                    {data.map((item, index) => (
                        <List.Item key={index}>
                            <Card>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e1d7d7', marginBottom: '5px' }}>
                                    <span>订单号：{item.id}</span>
                                    <span style={{ color: 'red' }}>{item?.integer === '1' ? '已完成' : '未完成'}</span>
                                </div>
                                <div className="orderItem" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {/* <Avatar src={demoAvatarImages[0]} /> */}
                                        <span style={{ marginLeft: '5px'}}>{item.createBy}</span>
                                    </div>
                                    <span>
                                        已得分成：
                                        <span style={{ color: 'red', fontWeight: '700'}}>{item.money} </span>
                                        元
                                    </span>
                                </div>
                            </Card>
                        </List.Item>
                    ))}
                </List>
            </div>
            <InfiniteScroll loadMore={loadHistoryItems} hasMore={hasMore} />
        </div>
    )
}
