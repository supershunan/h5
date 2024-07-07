import React from 'react';
import { NavBar, Form, Button, TextArea, Input, Stepper, Dialog, Image } from 'antd-mobile';
import styles from './index.less';

export default function FeedBack() {
    const back = () => {
        history.back();
    }

    const onFinish = (values: any) => {
        console.log(values)
    }
    return (
        <div className={styles.feedbackContainer}>
            <NavBar back='意见反馈' onBack={back}></NavBar>
            <div className={styles.feedbackbg}>
            </div>
            <Image
                src='/src/assets/images/loginbg.jpg'
                width={64}
                height={64}
                fit='cover'
                style={{ borderRadius: 4 }}
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
                    <Form.Item name='address' label='反馈信息'>
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
