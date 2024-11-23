import NavBarBack from "@/components/NavBarBack/NavBarBack";
import request from "@/utils/request/request";
import { RequstStatusEnum } from "@/utils/request/request.type";
import { InfiniteScroll, List, Image, Toast, Modal } from "antd-mobile";
import React, { useState } from "react";
import './index.less'
export default function MyWords() {
    const [data, setData] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [params, setParmas] = useState<{ page: number, rows: number }>({ page: 1, rows: 5 });

    const loadMyWords = async () => {
        const res = await request('/newApi/worksAlias/page', {
            method: 'POST',
            body: params,
        });
        const status = res.code === RequstStatusEnum.success && res.rows.length > 0;

        if (status) {
            const newData = res.rows
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

    const wordsItemDetail = (data: { keywords: string, oriName: string }) => {
        Modal.show({
            content: (<div>
                <span>关键词：{data.keywords}</span>
                <span style={{ color: '#07bf07', cursor: 'pointer', marginLeft: '10px' }} onClick={() => handleCopy(data.keywords)}>复制</span>
            </div>),
            closeOnMaskClick: true,
        })
    }

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
    return (
        <div style={{ padding: '46px 0' }}>
            <NavBarBack content={'我的词库'} style={{ maxWidth: '450px', background: '#fff', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div className="wordsContent">
                <List style={{ '--border-top': '0' }}>
                    {data.map((item, index) => (
                        <List.Item key={index} onClick={() => wordsItemDetail(item)}>
                            <div className="wordItem">
                                <div className="wordItemImg">
                                    <Image src={item.coverImg} width={'100%'} height={100} fit='fill' />
                                </div>
                                <div className="wordItemTitle">
                                    <span className="oriName">合集名：{item.oriName}</span>
                                    <span className="status">推广中</span>
                                    <span style={{ fontSize: '12px' }}>申请时间：{item.createTime}</span>
                                    {/* <span className="keywords">关键词：{item.keywords}</span> */}
                                </div>
                            </div>
                        </List.Item>
                    ))}
                </List>
                <InfiniteScroll loadMore={loadMyWords} hasMore={hasMore} />
            </div>
        </div>
    )
}