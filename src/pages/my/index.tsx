import React, { useEffect, useMemo, useState } from 'react'
import { Avatar, Button, Card, Divider, Image, Space } from 'antd-mobile'
import BgImg from '@/assets/images/welcome.jpg'
import FunctionBlock from '@/components/FunctionBlock/FunctionBlock';
import { JumpTypeEnum } from '@/components/FunctionBlock/type';
import { AppstoreOutline, GlobalOutline, SetOutline, PayCircleOutline, LinkOutline, ReceiptOutline, RightOutline } from 'antd-mobile-icons';
import './index.less'
import { history } from 'umi';
import request from '@/utils/request/request';
import { RequstStatusEnum } from '@/utils/request/request.type';

export default function Me() {
    const [userInfo, setUserInfo] = useState();
    const BLOCK_CONTENT = [
        {
            name: '工具箱',
            jumpType: JumpTypeEnum.router,
            path: '/toolbox',
            icon: <AppstoreOutline style={{ fontSize: '31px' }} />
        },
        {
            name: '商务合作',
            jumpType: JumpTypeEnum.router,
            path: '/cooperation',
            icon: <GlobalOutline style={{ fontSize: '31px' }} />
        },
        {
            name: '历史收益',
            jumpType: JumpTypeEnum.router,
            path: '/historyIncome',
            icon: <PayCircleOutline style={{ fontSize: '31px' }} />
        },
        {
            name: '设置',
            jumpType: JumpTypeEnum.router,
            path: '/setting',
            icon: <SetOutline style={{ fontSize: '31px' }} />
        }
    ]
    const BLOCK_CONTENT2 = [
        {
            name: '邀请链接',
            jumpType: JumpTypeEnum.router,
            path: '',
            icon: <LinkOutline style={{ fontSize: '31px'}} />
        },
        {
            name: '团队收益',
            jumpType: JumpTypeEnum.router,
            path: '/teamBenefits',
            icon: <ReceiptOutline style={{ fontSize: '31px' }} />
        },
    ]

    useEffect(() => {
        getUserInfo();
    }, []);
    const functionBlock = useMemo(() => {
        return <FunctionBlock blockContent={BLOCK_CONTENT} style={{ padding: '0 6px' }} />
    }, [BLOCK_CONTENT]);

    const leaderFunctionBlock = useMemo(() => {
        return <FunctionBlock blockContent={BLOCK_CONTENT2} style={{ padding: '0 6px' }} />
    }, [BLOCK_CONTENT2]);

    const goHistoryIncom = () => {
        history.push('/historyIncome')
    }

    const goWithdrawal = () => {
        history.push(`/withdrawal?totalIncome=${userInfo?.totalIncome}`)
    }

    const getUserInfo = async () => {
        const res = await request('/newApi/user/myInfo', { method: 'GET'});

        if (res.code === RequstStatusEnum.success) {
            setUserInfo(res.data)
        }
    }

    return (
        <div>
            <div className="bg">
                <Image src={BgImg} fit='fill' />
            </div>
            <div style={{ position: 'relative', top: '-50px', padding: '0 6px' }}>
                <Card>
                    <div className="userInfo">
                        <div style={{ display: 'flex', alignItems: 'center'}}>
                            <Avatar src={userInfo?.avatar} style={{ '--size': '64px', borderRadius: '50px' }} />
                            <div className="info">
                                <div className='nick'>{ userInfo?.nickname ?? '默认昵称' }</div>
                                <div>账号：{ userInfo?.account }</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '25px'}} onClick={() => history.push('/userInfo')}>
                            <RightOutline />
                        </div>
                    </div>
                </Card>
                <Card style={{ margin: '15px 0' }} title='总收益'>
                    <div className="income">
                        <div className="money">
                            <div className="videoMoney">
                                <div style={{ marginBottom: '20px' }}>视频收益（元）</div>
                                <div>10000.00</div>
                            </div>
                            <Divider direction='vertical' style={{ height: '3.9em' }} />
                            <div className="advertMoney">
                                <div style={{ marginBottom: '20px' }}>广告收益（元）</div>
                                <div>10000.00</div>
                            </div>
                        </div>
                        <div className="withdrawal">
                            <span>可提现 <span className='useableMoney'>￥{ userInfo?.canWithdrawalBalance ?? 0 }</span> 元</span>
                            <Button onClick={goWithdrawal} style={{ width: '100px', background: '#FF8047', color: '#fff' }}>提现</Button>
                        </div>
                    </div>
                </Card>
                <Card>
                    {functionBlock}
                </Card>
                <Card title='团长专属' style={{ marginTop: '20px' }}>
                    {leaderFunctionBlock}
                </Card>
            </div>
        </div>
    )
}
