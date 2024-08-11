import NavBarBack from '@/components/NavBarBack/NavBarBack'
import request from '@/utils/request/request'
import { RequstStatusEnum } from '@/utils/request/request.type'
import { CustomizeInfoEnum } from '@/utils/type/global.type'
import React, { useEffect, useState } from 'react'

export default function PrivacyPolicy() {
    const [privacyPolicy, setPrivacyPolicy] = useState();

    useEffect(() => {
        getUserAgreement();
    }, []);

    const getUserAgreement = async () => {
        const res = await request(`/newApi/gconfig/getByType/${CustomizeInfoEnum.privacyPolicy}`, { method: 'GET' })
        res.code === RequstStatusEnum.success && setPrivacyPolicy(res.data[0])
    }
    return (
        <div style={{ padding: '46px 0' }}>
            <NavBarBack content={'隐私政策'} style={{ background: '#fff', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
            隐私政策
            <div>
                {privacyPolicy?.val}
            </div>
        </div>
    )
}
