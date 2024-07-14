import NavBarBack from '@/components/NavBarBack/NavBarBack'
import { List } from 'antd-mobile'
import React, { useState } from 'react'

export default function HistoryIncome() {
    const [data, setData] = useState([
        {
            id: 1,
            time: '2024-01-01',
            videoMoney: '100',
            advertMoney: '100',
        },
        {
            id: 2,
            time: '2024-01-01',
            videoMoney: '100',
            advertMoney: '100',
        }
    ])
    return (
        <div style={{ padding: '46px 0' }}>
            <NavBarBack content={'历史收益'} style={{ background: '#fff', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div style={{ padding: '6px' }}>
                <div style={{ display: 'flex', background: '#fff', fontSize: '15px', fontWeight: '700', textAlign: 'center' }}>
                    <span style={{ flex: '1' }}>日期</span>
                    <span style={{ flex: '1' }}>视频收益(元)</span>
                    <span style={{ flex: '1' }}>广告收益(元)</span>
                </div>
                <List style={{ '--border-top': '0'}}>
                    {data.map((item, index) => (
                        <List.Item key={index}>
                            <div style={{ display: 'flex', textAlign: 'center' }}>
                                <span style={{ flex: '1' }}>{item.time}</span>
                                <span style={{ flex: '1' }}>{item.videoMoney}</span>
                                <span style={{ flex: '1' }}>{item.advertMoney}</span>
                            </div>
                        </List.Item>
                    ))}
                </List>
            </div>
        </div>
    )
}
