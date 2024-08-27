import React, { useEffect, useMemo, useState } from 'react';
import { history } from 'umi';
import { Card } from 'antd-mobile';
import { TopSwiper } from '@/components/TopSwiper/TopSwiper';
import FunctionBlock from '@/components/FunctionBlock/FunctionBlock';
import { JumpTypeEnum } from '@/components/FunctionBlock/type';
import { FolderOutline, UserSetOutline, DownlandOutline, VideoOutline } from 'antd-mobile-icons';
import styles from './index.less';
import request from '@/utils/request/request';
import { RequstStatusEnum } from '@/utils/request/request.type';
import { CustomizeInfoEnum } from '@/utils/type/global.type';

export default function Upload() {
    const [swipPictures, setSwipPictures] = useState([]);
    const [advertisementTextlls, setAdvertisementTextlls] = useState({ content: '广告栏内容' });
    const [platformCustomer, setPlatformCustomer] = useState({ val: 'res'});
    const BLOCK_CONTENT = [
        {
            name: '合集管理',
            jumpType: JumpTypeEnum.router,
            path: '/collectionManagement',
            icon: <FolderOutline style={{ fontSize: '31px' }} />
        },
        {
            name: '视频管理',
            jumpType: JumpTypeEnum.router,
            path: '/videoManagement',
            icon: <VideoOutline style={{ fontSize: '31px' }} />
        },
        {
            name: '平台客服',
            jumpType: JumpTypeEnum.modal,
            modalContent: platformCustomer?.val,
            icon: <UserSetOutline style={{ fontSize: '31px' }} />
        },
        {
            name: 'APP下载',
            jumpType: JumpTypeEnum.router,
            path: '/appdownload',
            icon: <DownlandOutline style={{ fontSize: '31px' }} />
        }
    ]

    useEffect(() => {
        getAdvertisment();
		getBanner();
        getPlatformCustomer();
	}, []);

    const getBanner = async () => {
		const res = await request('/newApi/gconfig/getBanners', {
            method: 'GET',
        });
		res.code === RequstStatusEnum.success && setSwipPictures(res.data);
	}

    const getAdvertisment = async () => {
		const res = await request('/newApi/noticeList/page', {
			method: 'post',
			body: { page: 1, rows: 5 }
		})
		if (res.code === RequstStatusEnum.success && res.rows.length) {
			setAdvertisementTextlls(res.rows[0])
		}
	}

    const getPlatformCustomer = async () => {
		const res = await request(`/newApi/gconfig/getByType/${CustomizeInfoEnum.customerService}`, { method: 'GET' })
		res.code === RequstStatusEnum.success && setPlatformCustomer(res.data[0])
	}

    /** 顶部轮播图和广告栏 */
    const TopContent = useMemo(() => {
        return <TopSwiper swipPictures={swipPictures} advertisementTextlls={advertisementTextlls?.content} />
    }, [swipPictures, advertisementTextlls]);

    /** 中间功能模块 */
    const functionBlock = useMemo(() => {
        return <FunctionBlock blockContent={BLOCK_CONTENT} style={{ padding: '0 6px' }} />
    }, [BLOCK_CONTENT]);

    return (
        <div style={{ paddingBottom: '60px' }}>
            {TopContent}
            {functionBlock}
            <div style={{ padding: '0 6px' }}>
                <Card title="上传视频" style={{ marginTop: '10px' }}>
                    <div className={styles.uploadvideo} onClick={() => { history.push('/uploadVideo') }}>
                    </div>
                </Card>
            </div>
        </div>
    )
}
