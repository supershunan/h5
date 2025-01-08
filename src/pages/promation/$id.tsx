import NavBarBack from '@/components/NavBarBack/NavBarBack'
import { useParams, useLocation, history } from 'umi'
import React, { useEffect, useState } from 'react'
import { Button, Card, Tag, Image, Modal, Toast } from 'antd-mobile';
import styles from './index.css'
import './index.less'
import request from "@/utils/request/request";
import { RequstStatusEnum } from "@/utils/request/request.type";

export default function TaskDetail() {
    const { id } = useParams<{ id: string, name: string }>();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const name = params.get('name');
    const [promationDetails, setPromationDetails] = useState<{ coverImg?: string; promotionUrl: string; promotionDetail: string; }>({
        coverImg: 'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60',
        promotionUrl: '',
        promotionDetail: '',
    });
    const [promotionDetails, setPromotionDetails] = useState<any>({});

    useEffect(() => {
        getPromationDetail();
        getpromotionDetails();
    }, []);

    const handleCopy = (text: string) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text)
                .then(() => {
                    Toast.show({
                        icon: "success",
                        content: "已复制剪切板",
                    });
                })
                .catch(err => {
                    console.error('Failed to copy text to clipboard:', err);
                });
        } else {
            // 提供兼容方案，使用 `document.execCommand` 复制
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                Toast.show({
                    icon: "success",
                    content: "已复制剪切板",
                });
            } catch (err) {
                console.error('Failed to copy text to clipboard:', err);
            }
            document.body.removeChild(textArea);
        }
    }

    const getPromationDetail = async () => {
        const res = await request(`/newApi/works/getById/${id}`, { method: 'GET' });
        res.code === RequstStatusEnum.success && setPromationDetails(res.data)
    }

    const getpromotionDetails = async () => {
        const res = await request('/newApi/gconfig/getByType/promotation_detail', { method: 'GET' });
        console.log(res, 'res')
        res.code === RequstStatusEnum.success && setPromotionDetails(res.data[0])
    }

    const goPromotion = () => {
        history.push(`/applyForPromotion/${id}`)
    }

    return (
        <div style={{ padding: '46px 0' }} className='applyForPromotion'>
            <NavBarBack content={name as string} style={{ maxWidth: '450px', background: '#f8f8fb', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div style={{ padding: '6px 6px' }} className='promationDetail'>
                <div style={{ display: 'flex' }}>
                    <Image src={promationDetails?.coverImg} width={730} fit='contain' />
                    <div style={{ display: 'flex', flexFlow: 'column', marginLeft: '10px'}}>
                        <span style={{fontSize: '14px', fontWeight: '800'}}>{promationDetails?.title}</span>
                        <div>
                            <span >简介：</span>
                            <span>{promationDetails?.info}</span>
                        </div>
                    </div>
                </div>
                <Card title="任务详情">
                    <div className={styles.shareUrl}>
                        <div>
                            <Tag color='success'>{promationDetails?.promotionUrl}</Tag>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button onClick={() => handleCopy(promationDetails?.promotionUrl)} color='primary' size='mini'>复制</Button>
                        </div>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <div dangerouslySetInnerHTML={{ __html: promotionDetails?.val }} />
                    </div>
                </Card>
                <div className='floatBtn'>
                    <Button onClick={goPromotion} block type='submit' color='primary' size='large'>
                        申请推广
                    </Button>
                </div>
            </div>
        </div>
    )
}