import React, { useEffect, useState } from 'react';
import { NavBar } from 'antd-mobile';
import styles from './index.less'
import { CustomizeInfoEnum } from '@/utils/type/global.type';
import request from '@/utils/request/request';
import { RequstStatusEnum } from '@/utils/request/request.type';

export default function AppDownload() {
    const [appDownload, setAppDownload] = useState('');

    useEffect(() => {
        getAppDownload();
    }, []);

    const back = () => {
        history.back();
    }

    const getAppDownload = async () => {
        const res = await request(`/newApi/gconfig/getByType/${CustomizeInfoEnum.permission}`, { method: 'GET' })
        res.code === RequstStatusEnum.success && res.data.length > 0 && setAppDownload(res.data[0].val)
    }

    return (
        <div className={styles.appdownloadContainer}>
            <NavBar back='返回' onBack={back}>
                APP下载
            </NavBar>
            <div style={{ padding: '0 10px' }}>
                <div
                    dangerouslySetInnerHTML={{ __html: appDownload }}
                    className='toolbox-content'
                />
            </div>
        </div>
    )
}
