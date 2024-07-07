import React from 'react';
import { NavBar, Form, Button, TextArea, Input, Stepper, Dialog, Image } from 'antd-mobile';
import styles from './index.less'

export default function AppDownload() {
    const back = () => {
        history.back();
    }
    return (
        <div className={styles.appdownloadContainer}>
            <NavBar back='意见反馈' onBack={back}></NavBar>
            <div style={{ color: '#3086ff', fontSize: '21px', textAlign: 'center' }}>
                正在建设中...
            </div>
        </div>
    )
}
