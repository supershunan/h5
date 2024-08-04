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
	const [videoSources, setVideoSources] = useState([
		'video1.mp4',
		'video2.mp4',
		'video3.mp4',
	]);
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
			modalContent: 'https://gw.alipayobjects.com/mdn/rms_efa86a/afts/img/A*SE7kRojatZ0AAAAAAAAAAAAAARQnAQ',
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
	}, []);

	const getBanner = async () => {
		const res = await request('/newApi/gconfig/getBanners', {
            method: 'GET',
        });
		res.code === RequstStatusEnum.success && setSwipPictures(res.data);
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
						{videoSources.map((src, index) => (
							<video key={index} src={src} width="100%" height="200" controls />
						))}
					</div>
				</Card>
			</div>
		</div>
	)
}
