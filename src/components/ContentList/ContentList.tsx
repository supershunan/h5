import React, { useRef } from 'react'
import { Grid, Popover, PullToRefresh, Image, Tag } from 'antd-mobile'
import { sleep } from 'antd-mobile/es/utils/sleep'
import { MoreOutline } from 'antd-mobile-icons';
import { WorkStatusEnum } from '@/utils/type/global.type'

interface ContentListProps {
    contentList: Array<T>;
    actions?: Array<T>;
    /** 是否禁用下拉刷新 */
    isPullToRefresh?: boolean;
    handleItem?: (item: T) => void;
    handlePop?: (node: T, item: T) => void;
    style?: React.CSSProperties;
}
export default function ContentList(props: ContentListProps) {
    const { contentList, actions, isPullToRefresh=false, handleItem, handlePop, style } = props;
    const statusBackgroud = useRef({
        1: '#87d068',
        2: '#ff8f1f',
        3: '#ff3141',
        4: '#ff3141',
        5: '#ff3141'
    })
    return (
        <div style={style}>
            <PullToRefresh
                onRefresh={async () => {
                    await sleep(1000)
                }}
                disabled={isPullToRefresh}
            >
                <Grid columns={2} gap={9}>
                    {contentList?.map((item, index) => {
                        return (
                            <Grid.Item key={index}>
                                <div className='contentItem' style={{ padding: '2px', background: '#f8f8fb' }}>
                                    <div onClick={() => handleItem && handleItem(item)}>
                                        <Image src={item.coverImg} width={'100%'} height={100} fit='fill' />
                                    </div>
                                    <div className='itemTitle' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{item.title}</span>
                                        {
                                            actions && <Popover.Menu
                                                actions={actions}
                                                placement='left-start'
                                                onAction={node => handlePop && handlePop(node, item)}
                                                trigger='click'
                                                style={{ textAlign: 'center' }}
                                            >
                                                <MoreOutline style={{ transform: 'rotate(90deg)', fontSize: '22px' }} />
                                            </Popover.Menu>
                                        }
                                    </div>
                                    {
                                        item.type === 'video' &&
                                        <div>
                                            当前状态：
                                            <span style={{ background: statusBackgroud.current[item.status], color: 'white', padding: 2, borderRadius: 4 }}>{WorkStatusEnum[item.status]}</span>
                                        </div>
                                    }
                                </div>
                            </Grid.Item>
                        )
                    })}
                </Grid>
            </PullToRefresh>
        </div>
    )
}
