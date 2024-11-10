import { useMemo, useState, useEffect, useRef } from 'react';
import { Card } from 'antd-mobile';
import { BankcardOutline, UserSetOutline, DownlandOutline, FileOutline } from 'antd-mobile-icons'
import styles from './index.less';
import { TopSwiper } from '@/components/TopSwiper/TopSwiper';
import FunctionBlock from '@/components/FunctionBlock/FunctionBlock';
import { JumpTypeEnum } from '@/components/FunctionBlock/type';
import request from '@/utils/request/request';
import { RequstStatusEnum } from '@/utils/request/request.type';
import { CustomizeInfoEnum } from '@/utils/type/global.type';

export default function Home() {
	const [swipPictures, setSwipPictures] = useState([]);
	const [advertisementTextlls, setAdvertisementTextlls] = useState({ content: '广告栏内容' });
	const [videoSources, setVideoSources] = useState([]);
	const [platformCustomer, setPlatformCustomer] = useState({ val: 'res'});
	const [thumbnails, setThumbnails] = useState({});
    const videoRefs = useRef([]);
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
		const res = await request('/newApi/noticeList/page', {
			method: 'post',
			body: { page: 1, rows: 5 }
		})
		if (res.code === RequstStatusEnum.success && res.rows.length) {
			setAdvertisementTextlls(res.rows[0])
		}
	}

	const getUseSource = async () => {
		const res = await request(`/newApi/gconfig/getByType/${CustomizeInfoEnum.useVideo}`, { method: 'GET' })
		res.code === RequstStatusEnum.success && setVideoSources(res.data)
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
							<video
								key={index}
								src={item?.val}
								width="100%"
								height="200"
								controls
							/>
						))}
					</div>
				</Card>
			</div>
		</div>
	)
}
