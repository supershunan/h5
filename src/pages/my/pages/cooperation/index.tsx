import React from 'react';
import { NavBar, Form, Button, TextArea, Input, Stepper, Dialog, Image } from 'antd-mobile';
import styles from './index.less';
import feedBackBg from '@/assets/images/cooperation.jpg';

export default function Cooperation() {
    const back = () => {
        history.back();
    }

    const onFinish = (values: any) => {
        console.log(values)
    }
    return (
        <div className={styles.feedbackContainer}>
            <NavBar back='返回' onBack={back}>
                商务合作
            </NavBar>
            <div className={styles.feedbackbg}>
            </div>
            <Image
                src={feedBackBg}
                width={'100%'}
                height={'100%'}
                fit='cover'
            />
            <div>
                <Form
                    name='form'
                    onFinish={onFinish}
                    layout='horizontal'
                    footer={
                        <Button block type='submit' color='primary' size='large'>
                            提交
                        </Button>
                    }
                >
                    <Form.Item
                        name='name'
                        label='称呼'
                    >
                        <Input onChange={console.log} placeholder='请输入' />
                    </Form.Item>
                    <Form.Item name='amount' label='手机号/微信号'>
                        <Input onChange={console.log} placeholder='请输入' />
                    </Form.Item>
                    <Form.Item name='address' label='商务合作'>
                        <TextArea
                            placeholder='请输入地址'
                            maxLength={100}
                            rows={2}
                            showCount
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
