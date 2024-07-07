import React, { useMemo, useState } from 'react';
import { Swiper, Toast, Card, NoticeBar } from 'antd-mobile';
import styles from './index.less';
import { TopSwiperProps } from './type';

export const TopSwiper = (props: TopSwiperProps) => {
    const { swipPictures, advertisementTextlls } = props;
    const items = swipPictures.map((color, index) => (
        <Swiper.Item key={index}>
            <div
                className={styles.content}
                style={{ background: color.picture }}
                onClick={() => {
                    Toast.show(`你点击了卡片 ${index + 1}`)
                }}
            >
                {index + 1}
            </div>
        </Swiper.Item>
    ))
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
