import React, { useEffect, useState } from 'react';
import { history, useLocation } from 'umi';
import { Modal, Card, Button, Toast } from 'antd-mobile';
import { BankcardOutline, UserSetOutline, DownlandOutline, FileOutline } from 'antd-mobile-icons';
import styles from './index.less';
import { FunctionBlockProps, JumpTypeEnum, BlockContent } from './type';

export default function FunctionBlock(props: FunctionBlockProps) {
    const { blockContent, style } = props;
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageContent, setImageContent] = useState('');
    
    const copyURl = [
        'https://creator.lddian.com',
        'https://pro.lddian.com'
    ]
    
    const handleClick = (type: string, content: string) => {
        if (type === JumpTypeEnum['router']) {
            history.push(content)
        } else if (type === JumpTypeEnum['modal']) {
            setImageContent(content);
            setShowImageModal(true);
        } else if (type === JumpTypeEnum['copy']) {
            Modal.show({
               title: '请复制到浏览器打开',
               content: 
               <div>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>创作者邀请链接</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                            <span>{copyURl[0]}/login?id={content}</span>
                            <Button style={{ width:'70px', float: 'right' }} onClick={() => handleCopy(`${copyURl[0]}/login?id=${content}`)} block color='primary' size='mini'>
                            复制
                            </Button>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>推广员邀请链接</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  padding: '10px 0' }}>
                            <span>{copyURl[1]}/login?id={content}</span>
                            <Button style={{ width:'70px', float: 'right' }} onClick={() => handleCopy(`${copyURl[1]}/login?id=${content}`)} block color='primary' size='mini'>
                            复制
                            </Button>
                        </div>
                    </div>
               </div>,
                closeOnMaskClick: true,
            })
        }
    }

    const handleCloseImageModal = () => {
        setShowImageModal(false);
        setImageContent('');
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
            
            {/* 自定义图片模态框 */}
            {showImageModal && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                    onClick={handleCloseImageModal}
                >
                    <img 
                        src={imageContent}
                        alt="预览图片"
                        style={{
                            width: '200px',
                            height: '200px',
                            objectFit: 'contain',
                            borderRadius: '8px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    )
}
