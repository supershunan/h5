import { useMemo } from 'react';
import { Swiper, Toast, Card, NoticeBar, Image } from 'antd-mobile';
import styles from './index.less';
import { TopSwiperProps } from './type';

export const TopSwiper = (props: TopSwiperProps) => {
    const { swipPictures, advertisementTextlls } = props;

    const items = useMemo(() => swipPictures.map(item => (
        <Swiper.Item key={item.id}>
            <Image src={item.val} fit='fill' />
        </Swiper.Item>
    )), [swipPictures]);

    return (
        <>
            <Swiper loop autoplay>{items}</Swiper>
            <div className={styles.advertisement}>
                <Card>
                    <NoticeBar content={advertisementTextlls} color='alert' />
                </Card>
            </div>
        </>
    );
}
