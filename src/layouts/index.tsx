import React, { useEffect, useState } from 'react';
import type { FC } from 'react'
import {
  // Route,
  // Switch,
  history,
  useLocation,
  // MemoryRouter as Router,
  Outlet
} from 'umi';
import { Badge, TabBar } from 'antd-mobile';
import styles from './index.less';
import '@/pages/global.less';
import {
  AppOutline,
  AddCircleOutline,
  TravelOutline,
  UserOutline,
} from 'antd-mobile-icons';

export default function (props) {
  const tabs = [
    {
      key: '/home',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: '/upload',
      title: '上传',
      icon: <AddCircleOutline />,
    },
    {
      key: '/promation',
      title: '推广',
      icon: <TravelOutline />,
    },
    {
      key: '/my',
      title: '我的',
      icon: <UserOutline />,
    },
  ]

  const location = useLocation()
  const { pathname } = location
  const [activeKey, setActiveKey] = useState('/home');

  const setRouteActive = (value: string) => {
    console.log(value, props)
    setActiveKey(value)
    history.push(value)
  }


  return (
    <div>
      <Outlet />
      <div className={styles.bottomTabbar}>
        <TabBar activeKey={activeKey} onChange={value => setRouteActive(value)}>
          {tabs.map(item => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </div>
    </div>
  )
}