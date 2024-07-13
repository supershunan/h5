import NavBarBack from '@/components/NavBarBack/NavBarBack'
import { useParams, useLocation, history } from 'umi'
import React, { useState } from 'react'
import { Button, Card, Tag, Image } from 'antd-mobile';
import styles from './index.css'

export default function TaskDetail() {
    const demoSrc =
        'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60'
    const { id } = useParams<{ id: string, name: string }>();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const name = params.get('name');
    const [copySuccess, setCopySuccess] = useState('');
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(
            () => {
                setCopySuccess('复制成功!');
            },
            (err) => {
                setCopySuccess('复制失败!');
                console.error('复制失败!', err);
            }
        );
    }
    return (
        <div style={{ padding: '46px 0' }}>
            <NavBarBack content={name as string} style={{ background: '#f8f8fb', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div style={{ padding: '6px 6px' }}>
                <Image src={demoSrc} width={200} height={200} fit='contain' />
                <Card title="任务详情">
                    <div className={styles.shareUrl}>
                        <div>
                            <Tag color='success'>这是一段网盘地址</Tag>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button onClick={() => handleCopy('qqqq')} color='primary' size='mini'>复制</Button>
                        </div>
                    </div>
                    <div style={{ marginTop: '20px' }}>下面是富文本</div>
                </Card>
            </div>
        </div>
    )
}