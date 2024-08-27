import React, { useEffect } from 'react';
import { history, useLocation } from 'umi';
import { Modal, Card } from 'antd-mobile';
import { BankcardOutline, UserSetOutline, DownlandOutline, FileOutline } from 'antd-mobile-icons';
import styles from './index.less';
import { FunctionBlockProps, JumpTypeEnum, BlockContent } from './type';

export default function FunctionBlock(props: FunctionBlockProps) {
    const { blockContent, style } = props;
    const handleClick = (type: string, content: string) => {
        if (type === JumpTypeEnum['router']) {
            history.push(content)
        } else if (type === JumpTypeEnum['modal']) {
            Modal.show({
                image: content,
                closeOnMaskClick: true,
            })
        } else if (type === JumpTypeEnum['copy']) {
            Modal.show({
               title: '请复制到浏览器打开',
               content: window.location.origin + `/login?id=${content}`,
                closeOnMaskClick: true,
            })
        }
    }

    return (
        <div style={{...style}}>
            <Card>
                <div className={styles.functionalModules}>
                    {
                        blockContent.map((item: BlockContent, index) => {
                            return (
                                <div key={index} className={styles.item} onClick={() => handleClick(item.jumpType, item?.modalContent ?? item.path)}>
                                    {item.icon}
                                    <span>{item.name}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </Card>
        </div>
    )
}
