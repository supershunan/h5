import React, { useMemo, useState } from 'react';
import { Card } from 'antd-mobile';
import { TopSwiper } from '@/components/TopSwiper/TopSwiper';
import FunctionBlock from '@/components/FunctionBlock/FunctionBlock';
import { JumpTypeEnum } from '@/components/FunctionBlock/type';
import { FolderOutline, UserSetOutline, DownlandOutline, VideoOutline } from 'antd-mobile-icons';
import styles from './index.less';

export default function Upload() {
  const [swipPictures, setSwipPictures] = useState([
    {
      id: 0,
      picture: '#ace0ff',
    },
    {
      id: 1,
      picture: '#bcffbd',
    },
    {
      id: 3,
      picture: '#e4fabd',
    },
    {
      id: 4,
      picture: '#ffcfac',
    },
  ]);
  const [advertisementTextlls, setAdvertisementTextlls] = useState('广告栏内容');
  const BLOCK_CONTENT = [
		{
			name: '合集管理',
			jumpType: JumpTypeEnum.router,
			path: '/historyNotice',
			icon: <FolderOutline style={{ fontSize: '31px' }} />
		},
		{
			name: '视频管理',
			jumpType: JumpTypeEnum.router,
			path: '/feedback',
			icon: <VideoOutline style={{ fontSize: '31px' }} />
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
      { TopContent }
      { functionBlock }
      <Card title="上传视频" style={{ marginTop: '10px' }}>
					<div className={styles.uploadvideo}>
						
					</div>
				</Card>
    </div>
  )
}
