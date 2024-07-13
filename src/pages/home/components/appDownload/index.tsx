import React from 'react';
import { NavBar } from 'antd-mobile';
import styles from './index.less'

export default function AppDownload() {
    const back = () => {
        history.back();
    }
    return (
        <div className={styles.appdownloadContainer}>
            <NavBar back='返回' onBack={back}>
                APP下载
            </NavBar>
            <div style={{ color: '#3086ff', fontSize: '21px', textAlign: 'center' }}>
                正在建设中...
            </div>
        </div>
    )
}
