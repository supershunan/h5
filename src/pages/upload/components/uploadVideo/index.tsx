import React, { useState } from 'react';
import './index.less';
import NavBarBack from '@/components/NavBarBack/NavBarBack';
import UploadVideo from '@/components/UploadVideo/UploadVideo';

export default function UpladVideo() {
    return (
        <div style={{ padding: '46px 0'}}>
            <NavBarBack content={'上传视频'} style={{ maxWidth: '450px', background: '#f8f8fb', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            <div className='uploadContent'>
                <UploadVideo />
            </div>
        </div>
    )
}
