import React from 'react'
import { Grid, Popover, PullToRefresh, Image } from 'antd-mobile'
import { sleep } from 'antd-mobile/es/utils/sleep'
import { MoreOutline } from 'antd-mobile-icons';

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
                                        <Image src={'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60'} width={'100%'} height={100} fit='fill' />
                                    </div>
                                    <div className='itemTitle' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{item.name}</span>
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
                                </div>
                            </Grid.Item>
                        )
                    })}
                </Grid>
            </PullToRefresh>
        </div>
    )
}
