import React from 'react';
import { NavBar, Form, Button, TextArea, Input, Stepper, Dialog, Image, Toast } from 'antd-mobile';
import styles from './index.less';
import feedBackBg from '@/assets/images/cooperation.jpg';
import { RequstStatusEnum } from '@/utils/request/request.type';
import request from '@/utils/request/request';

export default function Cooperation() {
    const [form] = Form.useForm();
    const back = () => {
        history.back();
    }

    const onFinish = async (values: any) => {
        const data = values;
        const res = await request('/newApi/feedback/add', {
            method: 'POST',
            body: {
                ...data,
                type: 2
            }
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
                        <Input placeholder='请输入' />
                    </Form.Item>
                    <Form.Item name='phone' label='手机号/微信号'>
                        <Input placeholder='请输入' />
                    </Form.Item>
                    <Form.Item name='info' label='商务合作'>
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
