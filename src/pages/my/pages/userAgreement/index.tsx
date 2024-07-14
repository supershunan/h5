import NavBarBack from '@/components/NavBarBack/NavBarBack'
import React from 'react'

export default function UserAgreement() {
  return (
    <div>
        <NavBarBack content={'用户协议'} style={{ background: '#fff', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
      用户协议
    </div>
  )
}
