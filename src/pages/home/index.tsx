import { useMemo, useState, useEffect } from 'react';
import { Card } from 'antd-mobile';
import { BankcardOutline, UserSetOutline, DownlandOutline, FileOutline } from 'antd-mobile-icons'
import styles from './index.less';
import { TopSwiper } from '@/components/TopSwiper/TopSwiper';
import FunctionBlock from '@/components/FunctionBlock/FunctionBlock';
import { JumpTypeEnum } from '@/components/FunctionBlock/type';
import request from '@/utils/request/request';
import { RequstStatusEnum } from '@/utils/request/request.type';

export default function Home() {
	const [swipPictures, setSwipPictures] = useState([]);
	const [advertisementTextlls, setAdvertisementTextlls] = useState('广告栏内容');
	const [videoSources, setVideoSources] = useState([]);
	const [platformCustomer, setPlatformCustomer] = useState({ val: 'res'});
	const BLOCK_CONTENT = [
		{
			name: '历史公告',
			jumpType: JumpTypeEnum.router,
			path: '/historyNotice',
			icon: <BankcardOutline style={{ fontSize: '31px' }} />
		},
		{
			name: '意见反馈',
			jumpType: JumpTypeEnum.router,
			path: '/feedback',
			icon: <FileOutline style={{ fontSize: '31px' }} />
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
		getBanner();
		getAdvertisment();
		getUseSource();
		getPlatformCustomer();
	}, []);

	const getBanner = async () => {
		const res = await request('/newApi/gconfig/getBanners', {
            method: 'GET',
        });
		res.code === RequstStatusEnum.success && setSwipPictures(res.data);
	}

	const getAdvertisment = async () => {
		// const type = 'privacy_policy';
		// const res = await request(`/newApi/gconfig/getByType/${type}`, { method: 'GET' })
		// res.code === RequstStatusEnum.success && setAdvertisementTextlls()
	}

	const getUseSource = async () => {
		const type = 'use_video';
		const res = await request(`/newApi/gconfig/getByType/${type}`, { method: 'GET' })
		res.code === RequstStatusEnum.success && setVideoSources(res.data)
	}

	const getPlatformCustomer = async () => {
		const type = 'customer_service';
		const res = await request(`/newApi/gconfig/getByType/${type}`, { method: 'GET' })
		console.log(res)
		res.code === RequstStatusEnum.success && setPlatformCustomer(res.data[0])
	}

	/** 顶部轮播图和广告栏 */
	const TopContent = useMemo(() => {
		return <TopSwiper swipPictures={swipPictures} advertisementTextlls={advertisementTextlls} />
	}, [swipPictures, advertisementTextlls]);

	/** 中间功能模块 */
	const functionBlock = useMemo(() => {
		return <FunctionBlock blockContent={BLOCK_CONTENT} />
	}, [BLOCK_CONTENT]);

	return (
		<div>
			{TopContent}
			<div className={styles.homeContent}>
				{functionBlock}
				<Card title="使用教程" style={{ marginTop: '10px' }}>
					<div className="videos">
						{videoSources.map((item, index) => (
							<video key={index} src={item?.val} width="100%" height="200" controls />
						))}
					</div>
				</Card>
			</div>
		</div>
	)
}
