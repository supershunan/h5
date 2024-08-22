import React, { useRef, useState } from 'react';
import { Form, Button, TextArea, Input, Toast, Image } from 'antd-mobile';
import styles from './index.less';
import feedBackBg from '@/assets/images/feedback.jpg';
import NavBarBack from '@/components/NavBarBack/NavBarBack'
import request from '@/utils/request/request';
import { RequstStatusEnum } from '@/utils/request/request.type';

export default function FeedBack() {
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        const data = values;
        const res = await request('/newApi/feedback/add', {
            method: 'POST',
            body: data
        })
        if (res.code === RequstStatusEnum.success) {
            Toast.show({
                icon: 'success',
                content: `反馈成功`,
                afterClose: () => {
                    history.back();
                }
            });
            form.resetFields();
        } else {
            Toast.show({
                icon: 'fail',
                content: `反馈失败，请重试`,
            });
        }
    }

    return (
        <div className={styles.feedbackContainer}>
            <NavBarBack content={'意见反馈'} style={{ maxWidth: '450px', background: '#fff', position: 'fixed', top: '0', width: '100%', zIndex: '99' }} />
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
                    form={form}
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
                    <Form.Item name='phone' label='手机号/微信号'>
                        <Input onChange={console.log} placeholder='请输入' />
                    </Form.Item>
                    <Form.Item name='info' label='反馈信息'>
                        <TextArea
                            placeholder='请输入'
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
