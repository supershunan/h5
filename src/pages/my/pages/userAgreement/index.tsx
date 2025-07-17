import NavBarBack from '@/components/NavBarBack/NavBarBack'
import request from '@/utils/request/request'
import { RequstStatusEnum } from '@/utils/request/request.type'
import { CustomizeInfoEnum } from '@/utils/type/global.type'
import React, { useEffect, useState } from 'react'
import './index.less'

export default function UserAgreement() {
  const [userAgree, setUserAgree] = useState();

  useEffect(() => {
    getUserAgreement();
  }, []);

  const getUserAgreement = async () => {
    const res = await request(`/newApi/gconfig/getByType/${CustomizeInfoEnum.h5UserProtocol}`, { method: 'GET' })
    res.code === RequstStatusEnum.success && setUserAgree(res.data[0])
  }
  return (
    <div style={{ padding: '46px 0', height: '100%' }}>
      <NavBarBack content={'用户协议'} style={{ maxWidth: '450px', background: '#fff', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
        {/* <div
          dangerouslySetInnerHTML={{ __html: userAgree?.val }}
          className='toolbox-content'
        /> */}
        <iframe src="https://lddian.com/xe/yhxy.html" style={{ width: '100%', height: '100%' }}></iframe>
    </div>
  )
}
